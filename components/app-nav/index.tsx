"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/routes";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppNavMobileMenu } from "./components/app-nav-mobile-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavLink } from "./components/nav-link";
import { UserDropdown } from "@/components/user-dropdown";
import type { TNavUser } from "./types";

const NAV_LINKS = [
  { key: "dashboard", href: ROUTES.dashboard },
  { key: "properties", href: ROUTES.properties },
  { key: "providers", href: ROUTES.providers },
  { key: "meters", href: ROUTES.meters },
  { key: "bills", href: ROUTES.bills },
  { key: "payments", href: ROUTES.payments },
] as const;

type TProps = {
  user: TNavUser;
};

export const AppNav = ({ user }: TProps) => {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const isActive = (href: string) =>
    href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href);

  const links = NAV_LINKS.map(({ key, href }) => ({
    href,
    label: t(key),
    active: isActive(href),
  }));

  return (
    <header className="bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-16 px-4 sm:px-6 lg:px-8">
        <Logo href={ROUTES.home} />

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            {user.systemRole === "admin" && (
              <Link
                href={ROUTES.admin.root}
                aria-label={t("adminDashboard")}
                className="inline-flex size-9 items-center justify-center rounded-md text-amber-700 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-950"
              >
                <Shield className="size-4" />
              </Link>
            )}
            <LanguageSwitcher ruEnabled={user.ruLocaleEnabled} />
            <ThemeToggle />
            <div className="bg-border mx-2 h-5 w-px" />
          </div>
          <div className="hidden md:flex">
            <UserDropdown user={user} />
          </div>
          <AppNavMobileMenu links={links} user={user} />
        </div>
      </div>
    </header>
  );
};
