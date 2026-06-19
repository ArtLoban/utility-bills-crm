import { SERVICE_TYPE_CODES } from "@/features/services/service-type";
import type { UserId } from "@/lib/db/schema/auth";
import type { TLocale } from "@/lib/locale/constants";

import { resolveChannelForUser } from "./channel";
import { buildDigest } from "./digest";
import type { TDueReminderBlock } from "./digest";
import { infraFail } from "./result";
import type { TInfraResult } from "./result";
import { serviceTranslatorFor } from "./service-translator";
import { sendTelegramMessage } from "./telegram";

// Illustrative reminders for the admin debug "send sample digest" tool. The format and the
// localized service labels mirror a real digest; the property names and reminder text are fixed
// English examples — the body's only locale-dependent part is the service label, exactly as the
// cron renders it (real users' reminder text is free-form in whatever language they wrote).
const SAMPLE_DIGEST_BLOCKS: TDueReminderBlock[] = [
  {
    propertyName: "Maple Street Apartment",
    serviceTypeCode: SERVICE_TYPE_CODES.ELECTRICITY,
    text: "Submit the meter reading before the 25th.",
  },
  {
    propertyName: "Maple Street Apartment",
    serviceTypeCode: SERVICE_TYPE_CODES.COLD_WATER,
    text: "Invoice is due — pay this week.",
  },
];

// Renders the sample digest exactly as the cron would, in the given locale.
const buildSampleDigest = async (locale: TLocale): Promise<string> => {
  const translateService = await serviceTranslatorFor(locale);
  return buildDigest(SAMPLE_DIGEST_BLOCKS, translateService);
};

// Sends a sample digest to one user's own Telegram chat — the on-demand counterpart to the daily
// cron, used by the admin debug page to verify the send path end-to-end. Reuses sendTelegramMessage's
// infra-level string error channel; a missing channel is reported the same way (the caller toasts it).
export const sendSampleDigest = async (userId: UserId, locale: TLocale): Promise<TInfraResult> => {
  const chatId = await resolveChannelForUser(userId);
  if (!chatId) return infraFail("No linked Telegram channel");

  return sendTelegramMessage(chatId, await buildSampleDigest(locale));
};
