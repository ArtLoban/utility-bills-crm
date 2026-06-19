import { afterEach, describe, expect, it, vi } from "vitest";

import type { UserId } from "@/lib/db/schema/auth";
import { LOCALES } from "@/lib/locale/constants";
import { ok } from "@/lib/errors";

// Mock the two collaborators so the orchestration is tested in isolation — no DB (resolveChannel)
// and no Bot API (sendTelegramMessage). The translator + buildDigest run for real (both pure).
vi.mock("../channel", () => ({ resolveChannelForUser: vi.fn() }));
vi.mock("../telegram", () => ({ sendTelegramMessage: vi.fn() }));

import { resolveChannelForUser } from "../channel";
import { infraFail } from "../result";
import { sendTelegramMessage } from "../telegram";
import { sendSampleDigest } from "../sample-digest";

const USER_ID = "00000000-0000-0000-0000-000000000001" as UserId;
const CHAT_ID = "7700000001";

const resolveChannelMock = vi.mocked(resolveChannelForUser);
const sendMessageMock = vi.mocked(sendTelegramMessage);

afterEach(() => {
  vi.clearAllMocks();
});

describe("sendSampleDigest", () => {
  it("returns an error and sends nothing when the user has no linked channel", async () => {
    resolveChannelMock.mockResolvedValue(null);

    const result = await sendSampleDigest(USER_ID, LOCALES.EN);

    expect(result).toEqual(infraFail("No linked Telegram channel"));
    expect(sendMessageMock).not.toHaveBeenCalled();
  });

  it("sends a non-empty digest to the resolved chat and forwards the send result", async () => {
    resolveChannelMock.mockResolvedValue(CHAT_ID);
    sendMessageMock.mockResolvedValue(ok(undefined));

    const result = await sendSampleDigest(USER_ID, LOCALES.EN);

    expect(result).toEqual(ok(undefined));
    expect(sendMessageMock).toHaveBeenCalledTimes(1);

    const [chatId, message] = sendMessageMock.mock.calls[0]!;
    expect(chatId).toBe(CHAT_ID);
    // Header (bracketed property + localized service label) plus the reminder text.
    expect(message).toContain("Maple Street Apartment");
    expect(message).toContain("Submit the meter reading before the 25th.");
  });

  it("propagates a send failure", async () => {
    resolveChannelMock.mockResolvedValue(CHAT_ID);
    sendMessageMock.mockResolvedValue(infraFail("Telegram sendMessage failed: 400 bad"));

    const result = await sendSampleDigest(USER_ID, LOCALES.EN);

    expect(result).toEqual(infraFail("Telegram sendMessage failed: 400 bad"));
  });
});
