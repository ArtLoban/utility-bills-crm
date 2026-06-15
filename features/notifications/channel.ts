import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import type { UserId } from "@/lib/db/schema/auth";
import { telegramChannels } from "@/lib/db/schema/notifications";

// The Telegram chat id delivery sends to, as a string for the sendMessage JSON body. NULL when
// the user has no channel — delivery skips them without claiming (the gate is a precondition,
// not a guarantee).
export const resolveChannelForUser = async (userId: UserId): Promise<string | null> => {
  const [channel] = await db
    .select({ chatId: telegramChannels.chatId })
    .from(telegramChannels)
    .where(eq(telegramChannels.userId, userId))
    .limit(1);

  return channel ? String(channel.chatId) : null;
};

export type TTelegramLinkStatus = {
  connected: boolean;
  label: string | null;
};

// The Settings "Connected" state: whether the user has a channel, and its display label.
export const telegramLinkStatus = async (userId: UserId): Promise<TTelegramLinkStatus> => {
  const [channel] = await db
    .select({ label: telegramChannels.label })
    .from(telegramChannels)
    .where(eq(telegramChannels.userId, userId))
    .limit(1);

  return {
    connected: Boolean(channel),
    label: channel?.label ?? null,
  };
};
