"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type TFooterLink = { href: string; label: string };

type TProps = {
  links: TFooterLink[];
};

export const FooterNav = ({ links }: TProps) => {
  const pathname = usePathname();

  return (
    <>
      {links.map((link, i) => {
        const isActive = pathname === link.href;

        return (
          <Fragment key={link.href}>
            {i > 0 && <span aria-hidden className="hidden h-3.5 w-px bg-white/20 md:block" />}
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "text-sm transition-colors",
                isActive ? "font-medium text-white" : "text-zinc-200 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          </Fragment>
        );
      })}
    </>
  );
};
