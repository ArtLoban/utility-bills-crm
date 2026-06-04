import Link from "next/link";
import { LogIn, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PublicLogo } from "@/components/public-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserDropdown } from "@/components/user-dropdown";
import { PublicMobileMenu } from "@/components/public-mobile-menu";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { PublicHeaderShell } from "@/components/public-header-shell";
import { PublicNavLink } from "@/components/public-nav-link";

export const PublicHeader = async () => {
  const [session, t] = await Promise.all([auth(), getTranslations("landing")]);
  const user = session?.user;

  return (
    <PublicHeaderShell>
      <div className="mx-auto flex h-full max-w-[1100px] items-center gap-8 px-6">
        <PublicLogo />

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          <PublicNavLink href={ROUTES.home} label={t("nav.home")} />
          <PublicNavLink href={ROUTES.about} label={t("nav.about")} />
          <PublicNavLink href={ROUTES.project} label={t("nav.project")} />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user && (
            <Link
              href={ROUTES.dashboard}
              className="border-border text-foreground hover:bg-accent rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors"
            >
              {t("nav.goToApp")}
            </Link>
          )}
          {user?.systemRole === "admin" && (
            <Link
              href={ROUTES.admin.root}
              aria-label={t("nav.adminPanel")}
              className="inline-flex size-9 items-center justify-center rounded-md text-amber-700 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              <Shield className="size-4" />
            </Link>
          )}
          <ThemeToggle />
          <div className="bg-border mx-2 h-5 w-px" />
          {user ? (
            <UserDropdown
              user={{
                id: user.id,
                name: user.name ?? null,
                email: user.email ?? null,
                image: user.image ?? null,
                systemRole: user.systemRole,
                ruLocaleEnabled: user.ruLocaleEnabled,
              }}
            />
          ) : (
            <Link
              href={ROUTES.login}
              className="border-border text-foreground hover:bg-accent flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors"
            >
              <LogIn className="size-4" />
              {t("nav.signIn")}
            </Link>
          )}
        </div>
        <div className="ml-auto md:hidden">
          <PublicMobileMenu
            user={
              user
                ? {
                    id: user.id,
                    name: user.name ?? null,
                    email: user.email ?? null,
                    image: user.image ?? null,
                    systemRole: user.systemRole,
                    ruLocaleEnabled: user.ruLocaleEnabled,
                  }
                : null
            }
          />
        </div>
      </div>
    </PublicHeaderShell>
  );
};
