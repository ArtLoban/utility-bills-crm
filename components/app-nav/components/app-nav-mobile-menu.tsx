import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcherStub } from "./language-switcher-stub";
import { NavLink } from "./nav-link";

type TLink = {
  href: string;
  label: string;
  active: boolean;
};

type TProps = {
  links: TLink[];
};

export const AppNavMobileMenu = ({ links }: TProps) => (
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
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="flex items-center gap-2 border-t pt-4">
          <LanguageSwitcherStub />
          <ThemeToggle />
        </div>
      </div>
    </SheetContent>
  </Sheet>
);
