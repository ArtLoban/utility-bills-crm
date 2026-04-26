"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "dashboard" as const, href: "/dashboard" },
  { key: "properties" as const, href: "/properties" },
  { key: "bills" as const, href: "/bills" },
  { key: "payments" as const, href: "/payments" },
  { key: "settings" as const, href: "/settings" },
];

type TNavLinkKey = (typeof NAV_LINKS)[number]["key"];

// [DevNote] TProps
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
        ? "text-foreground underline decoration-violet-600 decoration-2 underline-offset-4"
        : "text-muted-foreground hover:text-foreground",
    )}
  >
    {label}
  </Link>
);

const UserAvatarStub = () => (
  <div className="flex size-8 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 select-none">
    U
  </div>
);

export const AppNav = () => {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <header className="bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo href="/dashboard" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ key, href }) => (
            <NavLink key={href} href={href} label={t(key as TNavLinkKey)} active={isActive(href)} />
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          {/* Language switcher stub */}
          <button
            className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md"
            aria-label="Switch language"
          >
            <Globe className="size-4" />
          </button>

          <ThemeToggle />

          <UserAvatarStub />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-6 pt-6">
                <Logo href="/dashboard" />
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map(({ key, href }) => (
                    <NavLink
                      key={href}
                      href={href}
                      label={t(key as TNavLinkKey)}
                      active={isActive(href)}
                    />
                  ))}
                </nav>
                <div className="flex items-center gap-2 border-t pt-4">
                  <button
                    className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md"
                    aria-label="Switch language"
                  >
                    <Globe className="size-4" />
                  </button>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
