import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/page-container";
import { requireSession } from "@/lib/auth/guards";
import { telegramLinkStatus } from "@/features/notifications";
import type { UserId } from "@/lib/db/schema/auth";
import { assertNever } from "@/lib/assert-never";

import { AccountSection } from "./_components/account-section";
import { PreferencesSection } from "./_components/preferences-section";
import { ProfileSection } from "./_components/profile-section";
import { TelegramSection } from "./_components/telegram-section";
import { SettingsTabsNav } from "./_components/settings-tabs-nav";
import { SETTINGS_TABS } from "./constants";
import { resolveSettingsTab } from "./_utils/resolve-tab";

type TProps = {
  searchParams: Promise<Record<string, string>>;
};

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage({ searchParams }: TProps) {
  const { tab } = await searchParams;
  const activeTab = resolveSettingsTab(tab);

  const [session, t] = await Promise.all([requireSession(), getTranslations("settings")]);
  const { id, name, email, image, ruLocaleEnabled } = session;

  const renderActiveTab = async (): Promise<ReactNode> => {
    switch (activeTab) {
      case SETTINGS_TABS.PROFILE:
        return <ProfileSection name={name ?? null} email={email ?? null} image={image ?? null} />;
      case SETTINGS_TABS.PREFERENCES:
        return <PreferencesSection ruLocaleEnabled={ruLocaleEnabled} />;
      case SETTINGS_TABS.NOTIFICATIONS: {
        const linkStatus = await telegramLinkStatus(id as UserId);
        return (
          <TelegramSection
            initialConnected={linkStatus.connected}
            initialLabel={linkStatus.label}
          />
        );
      }
      case SETTINGS_TABS.ACCOUNT:
        return <AccountSection email={email ?? null} />;
      default:
        return assertNever(activeTab);
    }
  };

  return (
    <PageContainer title={t("title")}>
      <SettingsTabsNav activeTab={activeTab} />
      <div className="max-w-2xl">{await renderActiveTab()}</div>
    </PageContainer>
  );
}
