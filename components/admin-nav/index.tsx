"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/routes";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { TNavUser } from "@/lib/types/nav";
import { AdminNavMobileMenu } from "./components/admin-nav-mobile-menu";
import { AdminUserDropdown } from "./components/admin-user-dropdown";
import { NavLink } from "./components/nav-link";

const NAV_LINKS = [
  { key: "adminDashboard", href: ROUTES.admin.root },
  { key: "adminProperties", href: ROUTES.admin.properties },
  { key: "adminUsers", href: ROUTES.admin.users },
  { key: "adminLanding", href: ROUTES.admin.landing },
] as const;

type TProps = {
  user: TNavUser;
};

export const AdminNav = ({ user }: TProps) => {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const isActive = (href: string) =>
    href === ROUTES.admin.root ? pathname === href : pathname.startsWith(href);

  const links = NAV_LINKS.map(({ key, href }) => ({
    href,
    label: t(key),
    active: isActive(href),
  }));

  return (
    <>
      <div className="h-[2px] w-full bg-amber-500" />
      <header className="bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-16 px-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-[7px] bg-violet-600">
              <Shield className="size-[15px] text-white" strokeWidth={1.75} />
            </div>
            <span className="text-md font-bold tracking-[-0.2px]">UtilityBills</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href={ROUTES.dashboard}
                className="border-border text-foreground hover:bg-accent mr-1 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors"
              >
                Go to App
              </Link>
              <LanguageSwitcher ruEnabled={user.ruLocaleEnabled} />
              <ThemeToggle />
              <div className="bg-border mx-2 h-5 w-px" />
              <AdminUserDropdown user={user} />
            </div>
            <AdminNavMobileMenu links={links} user={user} />
          </div>
        </div>
      </header>
    </>
  );
};
