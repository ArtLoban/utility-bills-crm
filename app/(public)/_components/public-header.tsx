import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PublicLogo } from "@/components/public-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { PublicMobileMenu } from "@/components/public-mobile-menu";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { PublicHeaderShell } from "./public-header-shell";

export const PublicHeader = async () => {
  const [session, t] = await Promise.all([auth(), getTranslations("landing")]);
  const user = session?.user;

  return (
    <PublicHeaderShell>
      <div className="mx-auto flex h-full max-w-[1100px] items-center gap-8 px-6">
        <PublicLogo />

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          <Link
            href={ROUTES.about}
            className="text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1 text-sm transition-colors"
          >
            {t("nav.about")}
          </Link>
          <Link
            href={ROUTES.project}
            className="text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1 text-sm transition-colors"
          >
            {t("nav.project")}
          </Link>
          {user && (
            <Link
              href={ROUTES.dashboard}
              className="text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1 text-sm transition-colors"
            >
              {t("nav.dashboard")}
            </Link>
          )}
          {user?.systemRole === "admin" && (
            <Link
              href={ROUTES.admin.root}
              className="text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1 text-sm transition-colors"
            >
              {t("nav.adminPanel")}
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href={user ? ROUTES.dashboard : ROUTES.login}
            className="border-border text-foreground hover:bg-accent rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors"
          >
            {user ? t("nav.goToApp") : t("nav.signIn")}
          </Link>
        </div>

        <div className="ml-auto md:hidden">
          <PublicMobileMenu isLoggedIn={!!user} isAdmin={user?.systemRole === "admin"} />
        </div>
      </div>
    </PublicHeaderShell>
  );
};
