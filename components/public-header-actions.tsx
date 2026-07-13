"use client";

import Link from "next/link";
import { LogIn, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserDropdown } from "@/components/user-dropdown";
import { ROUTES } from "@/lib/routes";
import { usePublicSession } from "@/lib/hooks/use-public-session";

export const PublicHeaderActions = () => {
  const { user } = usePublicSession();

  return (
    <div className="hidden items-center gap-2 md:flex">
      {user && (
        <Link
          href={ROUTES.dashboard}
          className="border-border text-foreground hover:bg-accent rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors"
        >
          Go to app
        </Link>
      )}
      {user?.systemRole === "admin" && (
        <Link
          href={ROUTES.admin.root}
          aria-label="Admin panel"
          className="inline-flex size-9 items-center justify-center rounded-md text-amber-700 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-950"
        >
          <Shield className="size-4" />
        </Link>
      )}
      <ThemeToggle />
      <div className="bg-border mx-2 h-5 w-px" />
      {user ? (
        <UserDropdown user={user} />
      ) : (
        <Link
          href={ROUTES.login}
          className="border-border text-foreground hover:bg-accent flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors"
        >
          <LogIn className="size-4" />
          Sign in
        </Link>
      )}
    </div>
  );
};
