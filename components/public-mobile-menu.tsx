"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
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
  const pathname = usePathname();

  const navLinkClass = (href: string) =>
    cn(
      "text-sm transition-colors",
      pathname === href
        ? "text-foreground underline decoration-violet-600 decoration-2 underline-offset-4"
        : "text-muted-foreground hover:text-foreground",
    );

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
            <Link href={ROUTES.home} className={navLinkClass(ROUTES.home)}>
              {t("nav.home")}
            </Link>
            <Link href={ROUTES.about} className={navLinkClass(ROUTES.about)}>
              {t("nav.about")}
            </Link>
            <Link href={ROUTES.project} className={navLinkClass(ROUTES.project)}>
              {t("nav.project")}
            </Link>
            {isLoggedIn && (
              <Link href={ROUTES.dashboard} className={navLinkClass(ROUTES.dashboard)}>
                {t("nav.dashboard")}
              </Link>
            )}
            {isAdmin && (
              <Link href={ROUTES.admin.root} className={navLinkClass(ROUTES.admin.root)}>
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
