import Link from "next/link";
import { LayoutDashboard, Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminBadge } from "./admin-badge";
import { NavLink } from "./nav-link";

type TLink = {
  href: string;
  label: string;
  active: boolean;
};

type TProps = {
  links: TLink[];
};

export const AdminNavMobileMenu = ({ links }: TProps) => (
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
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
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
);
