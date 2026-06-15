import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { telegramChannels, telegramLinkTokens } from "@/lib/db/schema/notifications";
import { issueLinkToken } from "@/features/notifications/linking";
import { POST } from "../route";

// Real DB (binding is the boundary under test), scoped to one test user and cleaned (lesson 0008).
const WEBHOOK_SECRET = "test-webhook-secret";
const CHAT_ID = 7_700_900_001;

let userId: UserId;

const webhookRequest = (body: unknown, secret?: string): Request =>
  new Request("https://app.test/api/telegram/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { "x-telegram-bot-api-secret-token": secret } : {}),
    },
    body: JSON.stringify(body),
  });

const startUpdate = (token: string, chatId = CHAT_ID): unknown => ({
  message: { text: `/start ${token}`, chat: { id: chatId }, from: { username: "tester" } },
});

const channelFor = async (uid: UserId) => {
  const [channel] = await db
    .select()
    .from(telegramChannels)
    .where(eq(telegramChannels.userId, uid))
    .limit(1);
  return channel ?? null;
};

beforeAll(async () => {
  process.env.TELEGRAM_WEBHOOK_SECRET = WEBHOOK_SECRET;

  const [user] = await db
    .insert(users)
    .values({ email: "test-webhook@test.invalid", name: "Webhook Tester" })
    .returning({ id: users.id });
  userId = user!.id;
});

beforeEach(async () => {
  await db.delete(telegramLinkTokens).where(eq(telegramLinkTokens.userId, userId));
  await db.delete(telegramChannels).where(eq(telegramChannels.userId, userId));
});

afterAll(async () => {
  await db.delete(users).where(eq(users.id, userId));
});

describe("POST /api/telegram/webhook — authorization", () => {
  it("rejects a request with no secret header (401) and binds nothing", async () => {
    const { token } = await issueLinkToken(userId);

    const response = await POST(webhookRequest(startUpdate(token)));

    expect(response.status).toBe(401);
    expect(await channelFor(userId)).toBeNull();
  });

  it("rejects a request with the wrong secret (401)", async () => {
    const { token } = await issueLinkToken(userId);

    const response = await POST(webhookRequest(startUpdate(token), "wrong-secret"));

    expect(response.status).toBe(401);
    expect(await channelFor(userId)).toBeNull();
  });
});

describe("POST /api/telegram/webhook — processing", () => {
  it("binds the chat and consumes the token on a valid /start (200)", async () => {
    const { token } = await issueLinkToken(userId);

    const response = await POST(webhookRequest(startUpdate(token), WEBHOOK_SECRET));
    expect(response.status).toBe(200);

    const channel = await channelFor(userId);
    expect(channel?.chatId).toBe(CHAT_ID);
    expect(channel?.label).toBe("@tester");

    const [tokenRow] = await db
      .select()
      .from(telegramLinkTokens)
      .where(eq(telegramLinkTokens.userId, userId));
    expect(tokenRow!.consumedAt).not.toBeNull();
  });

  it("ignores a non-/start update with 200 and binds nothing", async () => {
    const response = await POST(
      webhookRequest({ message: { text: "hello there", chat: { id: CHAT_ID } } }, WEBHOOK_SECRET),
    );

    expect(response.status).toBe(200);
    expect(await channelFor(userId)).toBeNull();
  });

  it("acknowledges an unknown token with 200 and binds nothing", async () => {
    const response = await POST(webhookRequest(startUpdate("no-such-token"), WEBHOOK_SECRET));

    expect(response.status).toBe(200);
    expect(await channelFor(userId)).toBeNull();
  });

  it("acknowledges an expired token with 200 and binds nothing", async () => {
    const token = "expired-webhook-token";
    await db
      .insert(telegramLinkTokens)
      .values({ token, userId, expiresAt: new Date(Date.now() - 1000) });

    const response = await POST(webhookRequest(startUpdate(token), WEBHOOK_SECRET));

    expect(response.status).toBe(200);
    expect(await channelFor(userId)).toBeNull();
  });

  it("acknowledges an already-consumed token with 200 and keeps the existing binding", async () => {
    const { token } = await issueLinkToken(userId);
    await POST(webhookRequest(startUpdate(token), WEBHOOK_SECRET)); // first use binds

    // Second delivery of the same token from a different chat must not rebind.
    const response = await POST(webhookRequest(startUpdate(token, 9_999), WEBHOOK_SECRET));
    expect(response.status).toBe(200);

    const channel = await channelFor(userId);
    expect(channel?.chatId).toBe(CHAT_ID);
  });
});
