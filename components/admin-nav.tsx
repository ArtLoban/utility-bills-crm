"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LayoutDashboard } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "adminDashboard" as const, href: "/art-admin" },
  { key: "adminProperties" as const, href: "/art-admin/properties" },
  { key: "adminUsers" as const, href: "/art-admin/users" },
  { key: "adminLanding" as const, href: "/art-admin/landing" },
];

type TAdminNavLinkKey = (typeof NAV_LINKS)[number]["key"];

type TNavLinkProps = {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
};

const NavLink = ({ href, label, active, onClick }: TNavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "text-sm transition-colors",
      active
        ? "text-foreground underline decoration-amber-500 decoration-2 underline-offset-4"
        : "text-muted-foreground hover:text-foreground",
    )}
  >
    {label}
  </Link>
);

const AdminBadge = () => (
  <span className="rounded border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
    Admin
  </span>
);

const UserAvatarStub = () => (
  <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700 select-none dark:bg-amber-950 dark:text-amber-400">
    U
  </div>
);

export const AdminNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  const isActive = (href: string) =>
    href === "/art-admin" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Amber accent line */}
      <div className="h-[2px] w-full bg-amber-500" />

      <header className="bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          {/* Logo + Admin badge */}
          <div className="flex items-center gap-2">
            <Logo href="/art-admin" />
            <AdminBadge />
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map(({ key, href }) => (
              <NavLink
                key={href}
                href={href}
                label={t(key as TAdminNavLinkKey)}
                active={isActive(href)}
              />
            ))}
          </nav>

          {/* Right side */}
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

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger
                className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center gap-2">
                    <Logo href="/art-admin" />
                    <AdminBadge />
                  </div>
                  <nav className="flex flex-col gap-1">
                    {NAV_LINKS.map(({ key, href }) => (
                      <NavLink
                        key={href}
                        href={href}
                        label={t(key as TAdminNavLinkKey)}
                        active={isActive(href)}
                      />
                    ))}
                  </nav>
                  <div className="border-t pt-4">
                    <Link
                      href="/dashboard"
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
                    >
                      <LayoutDashboard className="size-4" />
                      Switch to user view
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};
