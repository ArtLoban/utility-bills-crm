import { createTranslator } from "next-intl";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import type { UserId } from "@/lib/db/schema/auth";
import { REMINDER_DELIVERY_STATUSES, reminderDeliveries } from "@/lib/db/schema/notifications";
import type { ReminderDeliveryId } from "@/lib/db/schema/notifications";
import { SERVICE_TYPE_CODES } from "@/features/services/service-type";
import type { TLocale } from "@/lib/locale/constants";
import { logger } from "@/lib/logger";
import { buildDigest } from "./digest";
import type { TTranslateService } from "./digest";
import { kyivCivilDate, reminderFiresOn, toIsoDate } from "./core";
import { dueReminderCandidates } from "./query";
import type { TReminderCandidate } from "./query";
import { sendTelegramMessage } from "./telegram";

// What one daily run did — returned to the cron caller and logged. `skipped` covers both the
// idempotency skip (a user already claimed today) and the no-channel skip.
export type TDeliverySummary = {
  deliveryDate: string;
  dueUsers: number;
  sent: number;
  failed: number;
  skipped: number;
};

// The Telegram channel for a user. Slice 2 uses a single hardcoded test chat for everyone;
// per-user channels (resolved by userId) arrive with linking in slice 3. A missing channel
// means "skip without claiming" so a later link is not blocked by a phantom ledger row.
const resolveChannel = (): string | null => process.env.TELEGRAM_CHAT_ID ?? null;

// Atomically claims (user, date). The UNIQUE(user_id, delivery_date) index makes a second
// claim for the same day a no-op: onConflictDoNothing returns no row → already handled → skip.
const claimDelivery = async (
  userId: UserId,
  deliveryDate: string,
): Promise<ReminderDeliveryId | null> => {
  const [claimed] = await db
    .insert(reminderDeliveries)
    .values({ userId, deliveryDate, status: REMINDER_DELIVERY_STATUSES.CLAIMED })
    .onConflictDoNothing({
      target: [reminderDeliveries.userId, reminderDeliveries.deliveryDate],
    })
    .returning({ id: reminderDeliveries.id });

  return claimed?.id ?? null;
};

// Records the outcome of a send attempt against the claimed ledger row.
const recordOutcome = async (
  deliveryId: ReminderDeliveryId,
  status: typeof REMINDER_DELIVERY_STATUSES.SENT | typeof REMINDER_DELIVERY_STATUSES.FAILED,
  error: string | null,
): Promise<void> => {
  await db
    .update(reminderDeliveries)
    .set({ status, error })
    .where(eq(reminderDeliveries.id, deliveryId));
};

// Builds a service-name translator bound to a single locale, with no request-based negotiation:
// createTranslator is the explicit-locale core translator. The labels are precomputed from the
// known service-type codes (typed literals) so the digest's string-keyed lookup stays type-safe.
const serviceTranslatorFor = async (locale: TLocale): Promise<TTranslateService> => {
  // Relative (not `@/`) specifier: a template-literal dynamic import needs a statically
  // resolvable directory for the bundler to build the import context — the same form the
  // next-intl request loader uses (i18n/request.ts).
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "services.types" });

  const labels: Record<string, string> = Object.fromEntries(
    Object.values(SERVICE_TYPE_CODES).map((code) => [code, t(code)]),
  );

  return (code) => labels[code] ?? code;
};

// Groups firing candidates by owning user, preserving the query's stable order within each group.
const groupByUser = (candidates: TReminderCandidate[]): Map<UserId, TReminderCandidate[]> => {
  const grouped = new Map<UserId, TReminderCandidate[]>();
  for (const candidate of candidates) {
    const existing = grouped.get(candidate.userId);
    if (existing) existing.push(candidate);
    else grouped.set(candidate.userId, [candidate]);
  }
  return grouped;
};

// The daily delivery pass: resolve today's Kyiv date → load candidates → keep the ones that
// fire today → group per user → per user: claim (idempotent), render in their locale, send,
// record the outcome. `now` is injectable so tests pin a deterministic delivery date.
export const deliverDueReminders = async (now: Date = new Date()): Promise<TDeliverySummary> => {
  const today = kyivCivilDate(now);
  const deliveryDate = toIsoDate(today);

  const candidates = await dueReminderCandidates();
  const due = candidates.filter((candidate) =>
    reminderFiresOn(
      { anchorType: candidate.anchorType, anchorValue: candidate.anchorValue },
      today,
    ),
  );

  const byUser = groupByUser(due);
  const summary: TDeliverySummary = {
    deliveryDate,
    dueUsers: byUser.size,
    sent: 0,
    failed: 0,
    skipped: 0,
  };

  const channel = resolveChannel();
  if (!channel) {
    // No channel configured at all → skip everyone without claiming (forward-compatible with
    // per-user channels in slice 3, where this branch becomes per-user).
    summary.skipped = byUser.size;
    logger.warn({ deliveryDate, dueUsers: byUser.size }, "no Telegram channel configured; skipped");
    return summary;
  }

  for (const [userId, blocks] of byUser) {
    const deliveryId = await claimDelivery(userId, deliveryDate);
    if (!deliveryId) {
      summary.skipped += 1;
      continue;
    }

    const translateService = await serviceTranslatorFor(blocks[0]!.userLocale);
    const message = buildDigest(
      blocks.map(({ propertyName, serviceTypeCode, text }) => ({
        propertyName,
        serviceTypeCode,
        text,
      })),
      translateService,
    );

    const result = await sendTelegramMessage(channel, message);
    if (result.ok) {
      await recordOutcome(deliveryId, REMINDER_DELIVERY_STATUSES.SENT, null);
      summary.sent += 1;
    } else {
      await recordOutcome(deliveryId, REMINDER_DELIVERY_STATUSES.FAILED, result.error);
      summary.failed += 1;
      logger.error({ userId, deliveryDate, error: result.error }, "reminder digest send failed");
    }
  }

  return summary;
};
