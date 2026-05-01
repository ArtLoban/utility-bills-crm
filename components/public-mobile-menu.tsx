"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { PublicLogo } from "@/components/public-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ROUTES } from "@/lib/routes";

type TProps = {
  isLoggedIn: boolean;
  isAdmin: boolean;
};

export const PublicMobileMenu = ({ isLoggedIn, isAdmin }: TProps) => {
  const t = useTranslations("landing");

  return (
    <Sheet>
      <SheetTrigger
        className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md"
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex flex-col gap-6 pt-6">
          <PublicLogo />
          <nav className="flex flex-col gap-1">
            <Link
              href={ROUTES.about}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("nav.about")}
            </Link>
            <Link
              href={ROUTES.project}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("nav.project")}
            </Link>
            {isLoggedIn && (
              <Link
                href={ROUTES.dashboard}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t("nav.dashboard")}
              </Link>
            )}
            {isAdmin && (
              <Link
                href={ROUTES.admin.root}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t("nav.adminPanel")}
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2 border-t pt-4">
            <ThemeToggle />
            <Link
              href={isLoggedIn ? ROUTES.dashboard : ROUTES.login}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {isLoggedIn ? t("nav.goToApp") : t("nav.signIn")}
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
