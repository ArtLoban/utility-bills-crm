"use client";

import Link from "next/link";
import { LogOut, Settings, Shield } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { ROUTES } from "@/lib/routes";
import { signOutAction } from "@/lib/auth/actions";
import type { TNavUser } from "@/lib/types/nav";

type TProps = {
  user: Pick<TNavUser, "systemRole">;
};

export const DrawerAccount = ({ user }: TProps) => (
  <div className="px-2.5 pt-2 pb-4">
    <p className="text-muted-foreground px-3 pt-2 pb-1.5 text-xs font-semibold tracking-wider uppercase">
      Account
    </p>

    <SheetClose asChild>
      <Link
        href={ROUTES.settings}
        className="hover:bg-accent flex h-11 items-center gap-3 rounded-lg px-3 text-[14.5px] font-medium transition-colors"
      >
        <Settings className="text-muted-foreground size-5 shrink-0" />
        Settings
      </Link>
    </SheetClose>

    {user.systemRole === "admin" && (
      <SheetClose asChild>
        <Link
          href={ROUTES.admin.root}
          className="hover:bg-accent flex h-11 items-center gap-3 rounded-lg px-3 text-[14.5px] font-medium transition-colors"
        >
          <Shield className="text-muted-foreground size-5 shrink-0" />
          Admin panel
        </Link>
      </SheetClose>
    )}

    <button
      onClick={() => signOutAction()}
      className="text-destructive hover:bg-destructive/10 flex h-11 w-full items-center gap-3 rounded-lg px-3 text-[14.5px] font-medium transition-colors"
    >
      <LogOut className="size-5 shrink-0" />
      Sign out
    </button>
  </div>
);
