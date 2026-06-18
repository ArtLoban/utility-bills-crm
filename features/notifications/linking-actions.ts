"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireMutableUser, requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { telegramChannels } from "@/lib/db/schema/notifications";
import { DemoModeError, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";

import { issueLinkToken } from "./linking";
import { telegramDeepLink } from "./telegram";
import { telegramLinkStatus } from "./channel";
import type { TTelegramLinkStatus } from "./channel";

// The Start deep-link the Settings page opens, plus the token's expiry so the client can stop
// polling once the window closes.
export type TStartLinkResult = {
  deepLink: string;
  expiresAt: string;
};

// Starts linking for the authenticated, non-demo user: issues a one-time token (replacing any
// prior unconsumed one) and returns its Start deep-link. Demo accounts are blocked — the shared
// demo user must never bind a real Telegram. A missing TELEGRAM_BOT_USERNAME is a server
// misconfiguration, not a user condition, so it throws (surfaces as 500) rather than handing back
// a dead link.
export const startTelegramLink = async (): Promise<Result<TStartLinkResult, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const { token, expiresAt } = await issueLinkToken(userId);
  const deepLink = telegramDeepLink(token);
  if (!deepLink) {
    throw new Error("TELEGRAM_BOT_USERNAME is not set; cannot build the Telegram deep-link");
  }

  return ok({ deepLink, expiresAt: expiresAt.toISOString() });
};

// Reads the current link status for the authenticated user — the Settings page polls this so the
// "Connected" state flips once the binding arrives out-of-band via the webhook.
export const getTelegramLinkStatus = async (): Promise<TTelegramLinkStatus> => {
  const userId = await requireUser();

  return telegramLinkStatus(userId);
};

// Disconnects the authenticated, non-demo user's channel (hard-delete). Reminders survive; with
// no channel they are silently skipped at delivery — the gate is a precondition, not a guarantee.
export const disconnectTelegram = async (): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  await db.delete(telegramChannels).where(eq(telegramChannels.userId, userId));
  revalidatePath(ROUTES.settings);

  return ok(undefined);
};
