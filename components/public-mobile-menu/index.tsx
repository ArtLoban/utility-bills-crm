"use client";

import Link from "next/link";
import { LogIn, Menu, Moon, Sun, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PublicLogo } from "@/components/public-logo";
import { DrawerHeader } from "@/components/drawer-header";
import { DrawerAccount } from "@/components/drawer-account";
import { ROUTES } from "@/lib/routes";
import type { TNavUser } from "@/lib/types/nav";

type TProps = {
  user: TNavUser | null;
  showAbout: boolean;
  showProject: boolean;
};

export const PublicMobileMenu = ({ user, showAbout, showProject }: TProps) => {
  const t = useTranslations("landing");
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const navLinkClass = (href: string) =>
    cn(
      "flex h-11 items-center rounded-lg px-3 text-[14.5px] font-medium transition-colors",
      pathname === href
        ? "text-foreground underline decoration-violet-600 decoration-2 underline-offset-4"
        : "text-muted-foreground hover:text-foreground",
    );

  const themeSection = (
    <div className="px-2.5 py-2">
      <p className="text-muted-foreground px-3 pt-2 pb-1.5 text-xs font-semibold tracking-wider uppercase">
        Preferences
      </p>
      <div className="flex h-11 items-center gap-3 px-3">
        <Sun className="text-muted-foreground size-5 shrink-0" />
        <span className="flex-1 text-[14.5px] font-medium">Theme</span>
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
  );

  return (
    <Sheet>
      <SheetTrigger
        className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md"
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 p-0 data-[side=right]:w-72 data-[side=right]:sm:max-w-72"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        {user ? (
          <>
            <DrawerHeader user={user} />
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2.5 pt-2 pb-1">
                <SheetClose asChild>
                  <Link href={ROUTES.home} className={navLinkClass(ROUTES.home)}>
                    {t("nav.home")}
                  </Link>
                </SheetClose>
                {showAbout && (
                  <SheetClose asChild>
                    <Link href={ROUTES.about} className={navLinkClass(ROUTES.about)}>
                      {t("nav.about")}
                    </Link>
                  </SheetClose>
                )}
                {showProject && (
                  <SheetClose asChild>
                    <Link href={ROUTES.project} className={navLinkClass(ROUTES.project)}>
                      {t("nav.project")}
                    </Link>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Link href={ROUTES.dashboard} className={navLinkClass(ROUTES.dashboard)}>
                    {t("nav.dashboard")}
                  </Link>
                </SheetClose>
              </nav>
              <div className="bg-border mx-4 h-px" />
              {themeSection}
            </div>
            <div className="border-t">
              <DrawerAccount user={{ systemRole: user.systemRole }} />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b px-4 pt-5 pb-4">
              <PublicLogo />
              <SheetClose asChild>
                <button
                  aria-label="Close menu"
                  className="hover:bg-accent -mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                >
                  <X className="size-5" />
                </button>
              </SheetClose>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2.5 pt-2 pb-1">
                <SheetClose asChild>
                  <Link href={ROUTES.home} className={navLinkClass(ROUTES.home)}>
                    {t("nav.home")}
                  </Link>
                </SheetClose>
                {showAbout && (
                  <SheetClose asChild>
                    <Link href={ROUTES.about} className={navLinkClass(ROUTES.about)}>
                      {t("nav.about")}
                    </Link>
                  </SheetClose>
                )}
                {showProject && (
                  <SheetClose asChild>
                    <Link href={ROUTES.project} className={navLinkClass(ROUTES.project)}>
                      {t("nav.project")}
                    </Link>
                  </SheetClose>
                )}
              </nav>
              <div className="bg-border mx-4 h-px" />
              {themeSection}
            </div>
            <div className="border-t">
              <div className="px-2.5 pt-2 pb-4">
                <SheetClose asChild>
                  <Link
                    href={ROUTES.login}
                    className="hover:bg-accent flex h-11 items-center gap-3 rounded-lg px-3 text-[14.5px] font-medium transition-colors"
                  >
                    <LogIn className="text-muted-foreground size-5 shrink-0" />
                    {t("nav.signIn")}
                  </Link>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
