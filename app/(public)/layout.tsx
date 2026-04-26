import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { PublicMobileMenu } from "@/components/public-mobile-menu";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Center nav — desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              About
            </Link>
            <Link
              href="/project"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Project
            </Link>
          </nav>

          {/* Right side — desktop */}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile menu */}
          <div className="ml-auto md:hidden">
            <PublicMobileMenu />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-3 px-4 py-6 text-center sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <nav className="flex gap-4">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              About
            </Link>
            <Link
              href="/project"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Project
            </Link>
          </nav>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} UtilityBills CRM
          </p>
        </div>
      </footer>
    </div>
  );
}
