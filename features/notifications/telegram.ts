import { err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

const TELEGRAM_API_BASE = "https://api.telegram.org";

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
