import { config } from "dotenv";

config({ path: ".env.local" });

// Deep import (not the slice barrel) on purpose: this CLI script must not pull the barrel's
// React client components into a plain Node process. telegram.ts has no client-only deps.
import { TELEGRAM_WEBHOOK_PATH } from "@/features/notifications/telegram";

// One-time setup: registers the production webhook URL + secret with Telegram (BotFather bot).
// Run after deploying, with TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, and NEXT_PUBLIC_SITE_URL
// set. Re-running is safe — setWebhook is idempotent (it overwrites the current registration).
const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
};

const main = async (): Promise<void> => {
  const token = requireEnv("TELEGRAM_BOT_TOKEN");
  const secret = requireEnv("TELEGRAM_WEBHOOK_SECRET");
  const siteUrl = requireEnv("NEXT_PUBLIC_SITE_URL");

  const webhookUrl = `${siteUrl}${TELEGRAM_WEBHOOK_PATH}`;

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      // Only message updates carry /start — narrow the subscription to reduce noise.
      allowed_updates: ["message"],
    }),
  });

  const result: unknown = await response.json();
  if (!response.ok) {
    console.error(`setWebhook failed (${response.status}):`, result);
    process.exit(1);
  }

  console.log(`Webhook registered: ${webhookUrl}`);
  console.log(result);
};

void main();
