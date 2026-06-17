"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OverflowNav } from "@/components/overflow-nav";
import { PublicNavLink } from "@/components/public-nav-link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { TOverflowNavItem } from "@/components/overflow-nav/types";

type TProps = {
  links: {
    href: string;
    label: string;
  }[];
};

export const PublicNav = ({ links }: TProps) => {
  const pathname = usePathname();

  const items: TOverflowNavItem[] = links.map((link) => ({
    ...link,
    active: pathname === link.href,
  }));

  return (
    <OverflowNav
      items={items}
      moreLabel="More"
      triggerAccentClassName="text-primary"
      className="justify-center"
      renderInline={(item) => <PublicNavLink href={item.href} label={item.label} />}
      renderMenuItem={(item) => (
        <DropdownMenuItem key={item.href} asChild>
          <Link href={item.href} className={cn(item.active && "text-primary font-medium")}>
            {item.label}
          </Link>
        </DropdownMenuItem>
      )}
    />
  );
};
