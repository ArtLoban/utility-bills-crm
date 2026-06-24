"use client";

import Link from "next/link";
import {
  Bug,
  Building2,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/lib/routes";
import { signOutAction } from "@/lib/auth/actions";
import { DrawerHeader } from "@/components/drawer-header";
import type { TNavUser } from "@/lib/types/nav";
import type { TLink } from "../types";

const NAV_ICONS: Record<string, LucideIcon> = {
  [ROUTES.admin.root]: LayoutDashboard,
  [ROUTES.admin.properties]: Building2,
  [ROUTES.admin.users]: Users,
  [ROUTES.admin.landing]: Layout,
  [ROUTES.admin.debug]: Bug,
};

type TProps = {
  links: TLink[];
  user: TNavUser;
};

export const AdminNavMobileMenu = ({ links, user }: TProps) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger
        className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md md:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 p-0 data-[side=right]:w-80 data-[side=right]:sm:max-w-80"
      >
        <SheetTitle className="sr-only">Admin navigation</SheetTitle>
        <DrawerHeader user={user} />

        <div className="flex-1 overflow-y-auto">
          <nav className="px-2.5 pt-3 pb-2">
            {links.map((link) => {
              const Icon = NAV_ICONS[link.href];
              return (
                <SheetClose key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors",
                      link.active
                        ? "bg-admin-accent/15 text-admin-accent [&_svg]:text-admin-accent"
                        : "text-foreground hover:bg-accent [&_svg]:text-muted-foreground",
                    )}
                  >
                    {Icon && <Icon className="size-5 shrink-0" />}
                    {link.label}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          <div className="bg-border mx-4 h-px" />

          <div className="px-2.5 py-2">
            <p className="text-muted-foreground px-3 pt-2 pb-1.5 text-xs font-semibold tracking-wider uppercase">
              Preferences
            </p>

            <div className="flex h-11 items-center gap-3 px-3">
              <Sun className="text-muted-foreground size-5 shrink-0" />
              <span className="flex-1 text-sm font-medium">Theme</span>
              <div className="bg-muted flex rounded-lg border p-0.5">
                <button
                  onClick={() => setTheme("light")}
                  aria-label="Light theme"
                  aria-pressed={resolvedTheme === "light"}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md transition-all",
                    resolvedTheme === "light"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Sun className="size-3.5" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  aria-label="Dark theme"
                  aria-pressed={resolvedTheme === "dark"}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md transition-all",
                    resolvedTheme === "dark"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Moon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t">
          <div className="px-2.5 pt-2 pb-4">
            <p className="text-muted-foreground px-3 pt-2 pb-1.5 text-xs font-semibold tracking-wider uppercase">
              Account
            </p>
            <SheetClose asChild>
              <Link
                href={ROUTES.settings}
                className="hover:bg-accent flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors"
              >
                <Settings className="text-muted-foreground size-5 shrink-0" />
                Settings
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href={ROUTES.dashboard}
                className="hover:bg-accent flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors"
              >
                <Zap className="text-muted-foreground size-5 shrink-0" />
                Go to App
              </Link>
            </SheetClose>
            <button
              onClick={() => signOutAction()}
              className="text-destructive hover:bg-destructive/10 flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors"
            >
              <LogOut className="size-5 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
