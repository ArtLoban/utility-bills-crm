import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/guards";

import { AccountSection } from "./_components/account-section";
import { PreferencesSection } from "./_components/preferences-section";
import { ProfileSection } from "./_components/profile-section";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account, profile, and application preferences.",
};

export default async function SettingsPage() {
  const { name, email, image, ruLocaleEnabled } = await requireSession();

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "36px 32px 64px" }}>
        <h1
          style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5, margin: "0 0 28px" }}
          className="text-zinc-950 dark:text-zinc-50"
        >
          Settings
        </h1>

        <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 28 }}>
          <ProfileSection name={name ?? null} email={email ?? null} image={image ?? null} />
          <PreferencesSection ruLocaleEnabled={ruLocaleEnabled} />
          <AccountSection email={email ?? null} />
        </div>
      </div>
    </div>
  );
}
