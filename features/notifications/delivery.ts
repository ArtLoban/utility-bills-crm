import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import type { UserId } from "@/lib/db/schema/auth";
import { REMINDER_DELIVERY_STATUSES, reminderDeliveries } from "@/lib/db/schema/notifications";
import type { ReminderDeliveryId } from "@/lib/db/schema/notifications";
import { logger } from "@/lib/logger";
import { buildDigest } from "./digest";
import { kyivCivilDate, reminderFiresOn, toIsoDate } from "./core";
import { dueReminderCandidates } from "./query";
import type { TReminderCandidate } from "./query";
import { serviceTranslatorFor } from "./service-translator";
import { sendTelegramMessage } from "./telegram";
import { resolveChannelForUser } from "./channel";

// What one daily run did — returned to the cron caller and logged. `skipped` covers both the
// idempotency skip (a user already claimed today) and the no-channel skip.
export type TDeliverySummary = {
  deliveryDate: string;
  dueUsers: number;
  sent: number;
  failed: number;
  skipped: number;
};

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

  for (const [userId, blocks] of byUser) {
    // Resolve the channel before claiming: a user with no channel is skipped WITHOUT a ledger
    // claim, so a later link is not blocked by a phantom row for today.
    const channel = await resolveChannelForUser(userId);
    if (!channel) {
      summary.skipped += 1;
      continue;
    }

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
