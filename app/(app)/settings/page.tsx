import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

import { AccountSection } from "./_components/account-section";
import { PreferencesSection } from "./_components/preferences-section";
import { ProfileSection } from "./_components/profile-section";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect(ROUTES.login);

  const { name, email, image } = session.user;

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
          <PreferencesSection />
          <AccountSection email={email ?? null} />
        </div>
      </div>
    </div>
  );
}
