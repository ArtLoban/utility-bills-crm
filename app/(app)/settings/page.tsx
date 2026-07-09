import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/page-container";
import { requireSession } from "@/lib/auth/guards";
import { telegramLinkStatus } from "@/features/notifications";
import type { UserId } from "@/lib/db/schema/auth";

import { AccountSection } from "./_components/account-section";
import { PreferencesSection } from "./_components/preferences-section";
import { ProfileSection } from "./_components/profile-section";
import { TelegramSection } from "./_components/telegram-section";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const { id, name, email, image, ruLocaleEnabled } = await requireSession();
  const [linkStatus, t] = await Promise.all([
    telegramLinkStatus(id as UserId),
    getTranslations("settings"),
  ]);

  return (
    <PageContainer title={t("title")}>
      <div className="flex max-w-2xl flex-col gap-7">
        <ProfileSection name={name ?? null} email={email ?? null} image={image ?? null} />
        <PreferencesSection ruLocaleEnabled={ruLocaleEnabled} />
        <TelegramSection initialConnected={linkStatus.connected} initialLabel={linkStatus.label} />
        <AccountSection email={email ?? null} />
      </div>
    </PageContainer>
  );
}
