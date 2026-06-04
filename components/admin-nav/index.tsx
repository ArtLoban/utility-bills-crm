"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/routes";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminNavMobileMenu } from "./components/admin-nav-mobile-menu";
import { NavLink } from "./components/nav-link";
import { UserAvatarStub } from "./components/user-avatar-stub";

const NAV_LINKS = [
  { key: "adminDashboard", href: ROUTES.admin.root },
  { key: "adminProperties", href: ROUTES.admin.properties },
  { key: "adminUsers", href: ROUTES.admin.users },
  { key: "adminLanding", href: ROUTES.admin.landing },
] as const;

type TProps = {
  user: { image: string | null };
};

export const AdminNav = ({ user }: TProps) => {
  const pathname = usePathname();
  const router = useRouter();
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
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger aria-label="User menu" className="cursor-pointer">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <UserAvatarStub />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push(ROUTES.dashboard)}
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
