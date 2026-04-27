import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { PublicMobileMenu } from "@/components/public-mobile-menu";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export const PublicHeader = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href={ROUTES.about}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            About
          </Link>
          <Link
            href={ROUTES.project}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Project
          </Link>
          {user && (
            <Link
              href={ROUTES.dashboard}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Dashboard
            </Link>
          )}
          {user?.systemRole === "admin" && (
            <Link
              href={ROUTES.admin.root}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {!user && (
            <Link
              href={ROUTES.login}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>

        <div className="ml-auto md:hidden">
          <PublicMobileMenu />
        </div>
      </div>
    </header>
  );
};
