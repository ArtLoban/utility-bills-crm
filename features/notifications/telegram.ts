import { z } from "zod";

import { err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { logger } from "@/lib/logger";

const TELEGRAM_API_BASE = "https://api.telegram.org";

// The path Telegram POSTs updates to — the single source for both the route location and the
// setWebhook registration script.
export const TELEGRAM_WEBHOOK_PATH = "/api/telegram/webhook";

// Header Telegram echoes the configured secret token in on every webhook delivery.
const WEBHOOK_SECRET_HEADER = "x-telegram-bot-api-secret-token";

// Sends one plain-text message to a Telegram chat via the Bot API.
// The error channel is a human-readable string, persisted verbatim in the delivery ledger's
// `error` column — Telegram/network failures are infrastructure, not domain errors, so they
// stay out of the DomainError hierarchy. A missing bot token is reported the same way: the job
// records the failure and moves on rather than throwing and aborting the whole run.
export const sendTelegramMessage = async (
  chatId: string,
  text: string,
): Promise<Result<void, string>> => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return err("TELEGRAM_BOT_TOKEN is not set");

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return err(`Telegram sendMessage failed: ${response.status} ${detail}`);
    }

    return ok(undefined);
  } catch (cause) {
    return err(cause instanceof Error ? cause.message : String(cause));
  }
};

// Builds the Start deep-link the user opens to begin linking. Null when TELEGRAM_BOT_USERNAME is
// unset (misconfiguration) — the caller surfaces that as a failure rather than emit a dead link.
export const telegramDeepLink = (token: string): string | null => {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (!botUsername) return null;

  return `https://t.me/${botUsername}?start=${token}`;
};

// Validates Telegram's secret-token header, fail-closed: a missing TELEGRAM_WEBHOOK_SECRET env
// (misconfiguration) rejects every request — an unconfigured webhook must never bind chats. A
// wrong header is a normal rejection (probe/attacker) and is not logged, to avoid noise.
export const isValidWebhookSecret = (request: Request): boolean => {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    logger.warn("TELEGRAM_WEBHOOK_SECRET is not set; rejecting all Telegram webhook requests");
    return false;
  }

  return request.headers.get(WEBHOOK_SECRET_HEADER) === secret;
};

// The fields we need from a Telegram update: the message text, the sender's chat id, and the
// optional name/username for a display label. Everything else in the update is ignored.
const telegramUpdateSchema = z.object({
  message: z.object({
    text: z.string(),
    chat: z.object({ id: z.number() }),
    from: z
      .object({ first_name: z.string().optional(), username: z.string().optional() })
      .optional(),
  }),
});

export type TStartCommand = {
  token: string;
  chatId: number;
  label: string | null;
};

// Extracts a `/start <token>` command from a Telegram update. Returns null for any update that is
// not a /start carrying a payload — the webhook acknowledges those with 200 and binds nothing.
export const parseStartCommand = (body: unknown): TStartCommand | null => {
  const parsed = telegramUpdateSchema.safeParse(body);
  if (!parsed.success) return null;

  const { text, chat, from } = parsed.data.message;
  const match = /^\/start\s+(\S+)/.exec(text.trim());
  if (!match) return null;

  const label = from?.username ? `@${from.username}` : (from?.first_name ?? null);

  return {
    token: match[1]!,
    chatId: chat.id,
    label,
  };
};
