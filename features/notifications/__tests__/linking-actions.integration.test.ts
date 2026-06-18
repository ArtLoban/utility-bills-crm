import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { telegramChannels, telegramLinkTokens } from "@/lib/db/schema/notifications";
import { ERROR_CODES } from "@/lib/errors";
import { auth } from "@/lib/auth";
import { disconnectTelegram, getTelegramLinkStatus, startTelegramLink } from "../linking-actions";

const BOT_USERNAME = "test_bot";

let userAId: UserId;
let userBId: UserId;

const mockAuth = (userId: UserId) =>
  vi
    .mocked(auth)
    .mockResolvedValue({ user: { id: userId } } as unknown as Awaited<ReturnType<typeof auth>>);

const mockDemoAuth = (userId: UserId) =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: userId, isDemo: true },
  } as unknown as Awaited<ReturnType<typeof auth>>);

const channelFor = async (uid: UserId) => {
  const [channel] = await db
    .select()
    .from(telegramChannels)
    .where(eq(telegramChannels.userId, uid))
    .limit(1);
  return channel ?? null;
};

beforeAll(async () => {
  process.env.TELEGRAM_BOT_USERNAME = BOT_USERNAME;

  const inserted = await db
    .insert(users)
    .values([
      { email: "test-linkact-a@test.invalid", name: "LinkAct A" },
      { email: "test-linkact-b@test.invalid", name: "LinkAct B" },
    ])
    .returning({ id: users.id });
  userAId = inserted[0]!.id;
  userBId = inserted[1]!.id;
});

beforeEach(async () => {
  await db.delete(telegramLinkTokens).where(inArray(telegramLinkTokens.userId, [userAId, userBId]));
  await db.delete(telegramChannels).where(inArray(telegramChannels.userId, [userAId, userBId]));
  vi.mocked(auth).mockReset();
});

afterAll(async () => {
  await db.delete(users).where(inArray(users.id, [userAId, userBId]));
});

describe("startTelegramLink", () => {
  it("issues a token and returns its deep-link for the authenticated user", async () => {
    mockAuth(userAId);

    const result = await startTelegramLink();
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const tokens = await db
      .select()
      .from(telegramLinkTokens)
      .where(eq(telegramLinkTokens.userId, userAId));
    expect(tokens).toHaveLength(1);
    expect(result.value.deepLink).toBe(`https://t.me/${BOT_USERNAME}?start=${tokens[0]!.token}`);
  });

  it("blocks demo accounts and issues no token", async () => {
    mockDemoAuth(userAId);

    const result = await startTelegramLink();
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);

    const tokens = await db
      .select()
      .from(telegramLinkTokens)
      .where(eq(telegramLinkTokens.userId, userAId));
    expect(tokens).toHaveLength(0);
  });
});

describe("disconnectTelegram", () => {
  it("removes only the caller's own channel", async () => {
    await db.insert(telegramChannels).values([
      { userId: userAId, chatId: 111, label: "A" },
      { userId: userBId, chatId: 222, label: "B" },
    ]);
    mockAuth(userAId);

    const result = await disconnectTelegram();
    expect(result.ok).toBe(true);

    expect(await channelFor(userAId)).toBeNull();
    expect((await channelFor(userBId))?.chatId).toBe(222);
  });

  it("blocks demo accounts and leaves the channel intact", async () => {
    await db.insert(telegramChannels).values({ userId: userAId, chatId: 111, label: "A" });
    mockDemoAuth(userAId);

    const result = await disconnectTelegram();
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);

    expect(await channelFor(userAId)).not.toBeNull();
  });
});

describe("getTelegramLinkStatus", () => {
  it("reports connected with the label when a channel exists", async () => {
    await db.insert(telegramChannels).values({ userId: userAId, chatId: 111, label: "@a" });
    mockAuth(userAId);

    expect(await getTelegramLinkStatus()).toEqual({ connected: true, label: "@a" });
  });

  it("reports disconnected when there is no channel", async () => {
    mockAuth(userBId);

    expect(await getTelegramLinkStatus()).toEqual({ connected: false, label: null });
  });
});
