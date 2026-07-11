"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { OverflowNav } from "@/components/overflow-nav";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { TNavUser } from "@/lib/types/nav";
import { AdminNavMobileMenu } from "./components/admin-nav-mobile-menu";
import { AdminUserDropdown } from "./components/admin-user-dropdown";
import { NavLink } from "./components/nav-link";

const NAV_LINKS = [
  { label: "Dashboard", href: ROUTES.admin.root },
  { label: "Properties", href: ROUTES.admin.properties },
  { label: "Users", href: ROUTES.admin.users },
  { label: "Landing", href: ROUTES.admin.landing },
  { label: "Debug", href: ROUTES.admin.debug },
] as const;

type TProps = {
  user: TNavUser;
};

export const AdminNav = ({ user }: TProps) => {
  const pathname = usePathname();

  const links = useMemo(
    () =>
      NAV_LINKS.map(({ label, href }) => ({
        href,
        label,
        active: href === ROUTES.admin.root ? pathname === href : pathname.startsWith(href),
      })),
    [pathname],
  );

  return (
    <>
      <div className="bg-admin-accent h-[2px] w-full" />
      <header className="bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <div className="bg-primary flex size-7 items-center justify-center rounded-[7px]">
              <Shield className="text-primary-foreground size-[15px]" strokeWidth={1.75} />
            </div>
            <span className="text-md font-bold tracking-[-0.2px]">UtilityBills</span>
          </Link>

          <OverflowNav
            items={links}
            moreLabel="More"
            triggerAccentClassName="text-admin-accent"
            renderInline={(item) => <NavLink {...item} />}
            renderMenuItem={(item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(item.active && "text-admin-accent font-medium")}
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            )}
          />

          <div className="ml-auto flex items-center gap-1">
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href={ROUTES.dashboard}
                className="border-border text-foreground hover:bg-accent mr-1 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors"
              >
                Go to App
              </Link>
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
