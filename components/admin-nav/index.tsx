"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminBadge } from "./components/admin-badge";
import { AdminNavMobileMenu } from "./components/admin-nav-mobile-menu";
import { NavLink } from "./components/nav-link";
import { UserAvatarStub } from "./components/user-avatar-stub";

const NAV_LINKS = [
  { key: "adminDashboard" as const, href: "/art-admin" },
  { key: "adminProperties" as const, href: "/art-admin/properties" },
  { key: "adminUsers" as const, href: "/art-admin/users" },
  { key: "adminLanding" as const, href: "/art-admin/landing" },
];

type TNavLinkKey = (typeof NAV_LINKS)[number]["key"];

export const AdminNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  const isActive = (href: string) =>
    href === "/art-admin" ? pathname === href : pathname.startsWith(href);

  const links = NAV_LINKS.map(({ key, href }) => ({
    href,
    label: t(key as TNavLinkKey),
    active: isActive(href),
  }));

  return (
    <>
      <div className="h-[2px] w-full bg-amber-500" />
      <header className="bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo href="/art-admin" />
            <AdminBadge />
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger aria-label="User menu" className="cursor-pointer">
                <UserAvatarStub />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                >
                  <LayoutDashboard className="size-4" />
                  Switch to user view
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AdminNavMobileMenu links={links} />
          </div>
        </div>
      </header>
    </>
  );
};
