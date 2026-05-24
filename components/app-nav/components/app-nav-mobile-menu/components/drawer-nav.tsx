import Link from "next/link";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import { NAV_ICONS } from "../constants";
import type { TLink } from "../../../types";

type TProps = {
  links: TLink[];
};

export const DrawerNav = ({ links }: TProps) => (
  <nav className="px-2.5 pt-3 pb-2">
    {links.map((link) => {
      const Icon = NAV_ICONS[link.href];
      return (
        <SheetClose key={link.href} asChild>
          <Link
            href={link.href}
            className={cn(
              "flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors",
              link.active
                ? "bg-brand-bg text-brand [&_svg]:text-brand"
                : "text-foreground hover:bg-accent [&_svg]:text-muted-foreground",
            )}
          >
            {Icon && <Icon className="size-5 shrink-0" />}
            {link.label}
          </Link>
        </SheetClose>
      );
    })}
  </nav>
);
