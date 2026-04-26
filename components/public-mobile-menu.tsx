"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export const PublicMobileMenu = () => (
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
        <Logo />
        <nav className="flex flex-col gap-1">
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
        <div className="flex items-center gap-2 border-t pt-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);
