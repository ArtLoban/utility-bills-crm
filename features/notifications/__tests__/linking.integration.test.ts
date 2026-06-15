import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { telegramChannels, telegramLinkTokens } from "@/lib/db/schema/notifications";
import { consumeStartToken, issueLinkToken } from "../linking";

const CHAT_ID = 7_700_100_500;

let userId: UserId;

beforeAll(async () => {
  const [user] = await db
    .insert(users)
    .values({ email: "test-link@test.invalid", name: "Link Tester" })
    .returning({ id: users.id });
  userId = user!.id;
});

beforeEach(async () => {
  await db.delete(telegramLinkTokens).where(eq(telegramLinkTokens.userId, userId));
  await db.delete(telegramChannels).where(eq(telegramChannels.userId, userId));
});

afterAll(async () => {
  // Cascade removes the user's tokens + channel.
  await db.delete(users).where(eq(users.id, userId));
});

const tokensFor = (uid: UserId) =>
  db.select().from(telegramLinkTokens).where(eq(telegramLinkTokens.userId, uid));

const channelFor = async (uid: UserId) => {
  const [channel] = await db
    .select()
    .from(telegramChannels)
    .where(eq(telegramChannels.userId, uid))
    .limit(1);
  return channel ?? null;
};

describe("issueLinkToken", () => {
  it("replaces the user's prior unconsumed token (one active token per user)", async () => {
    const first = await issueLinkToken(userId);
    const second = await issueLinkToken(userId);

    const rows = await tokensFor(userId);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.token).toBe(second.token);
    expect(rows[0]!.token).not.toBe(first.token);

    // The replaced token is dead — consuming it binds nothing.
    expect(await consumeStartToken({ token: first.token, chatId: CHAT_ID, label: null })).toBe(
      false,
    );
    expect(await channelFor(userId)).toBeNull();
  });
});

describe("consumeStartToken", () => {
  it("binds the chat to the token's user and consumes the token", async () => {
    const { token } = await issueLinkToken(userId);

    const bound = await consumeStartToken({ token, chatId: CHAT_ID, label: "@tester" });
    expect(bound).toBe(true);

    const channel = await channelFor(userId);
    expect(channel?.chatId).toBe(CHAT_ID);
    expect(channel?.label).toBe("@tester");

    const [tokenRow] = await tokensFor(userId);
    expect(tokenRow!.consumedAt).not.toBeNull();
  });

  it("rejects an already-consumed token, leaving the existing binding intact (single-use)", async () => {
    const { token } = await issueLinkToken(userId);
    expect(await consumeStartToken({ token, chatId: CHAT_ID, label: null })).toBe(true);

    expect(await consumeStartToken({ token, chatId: 9_999, label: "other" })).toBe(false);
    const channel = await channelFor(userId);
    expect(channel?.chatId).toBe(CHAT_ID);
  });

  it("rejects an expired token and binds nothing", async () => {
    const token = "expired-token-fixture";
    await db
      .insert(telegramLinkTokens)
      .values({ token, userId, expiresAt: new Date(Date.now() - 1000) });

    expect(await consumeStartToken({ token, chatId: CHAT_ID, label: null })).toBe(false);
    expect(await channelFor(userId)).toBeNull();
  });

  it("rejects an unknown token and binds nothing", async () => {
    expect(await consumeStartToken({ token: "no-such-token", chatId: CHAT_ID, label: null })).toBe(
      false,
    );
    expect(await channelFor(userId)).toBeNull();
  });
});
