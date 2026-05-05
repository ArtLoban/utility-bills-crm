"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

import { SettingsCard, SettingsCardBody, SettingsCardHeader } from "./settings-card";

type TProps = {
  email: string | null;
};

const GoogleGIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AccountSection = ({ email }: TProps) => (
  <SettingsCard>
    <SettingsCardHeader title="Account" description="Sign-in and session management." />
    <SettingsCardBody>
      {/* Google info row */}
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
        <GoogleGIcon />
        <div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Signed in with Google</div>
          <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">{email ?? "—"}</div>
        </div>
      </div>

      {/* Active sessions */}
      <div>
        <div className="mb-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
          Active sessions
        </div>
        <p className="text-sm leading-[1.6] text-zinc-500 dark:text-zinc-400">
          Per-device session management is coming in a future release.
        </p>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-700" />

      {/* Sign out everywhere */}
      <div>
        <div className="mb-1.5 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Sign out everywhere
        </div>
        <p className="mb-3.5 text-sm leading-[1.65] text-zinc-500 dark:text-zinc-400">
          This signs you out on all browsers and devices, including this one. You&apos;ll need to
          sign in again.
        </p>
        <Button
          variant="destructive"
          onClick={() => signOut({ callbackUrl: ROUTES.login })}
          style={{ height: 36 }}
        >
          Sign out of all devices
        </Button>
      </div>
    </SettingsCardBody>
  </SettingsCard>
);

export { AccountSection };
