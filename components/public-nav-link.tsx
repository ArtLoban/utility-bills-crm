"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type TProps = {
  href: string;
  label: string;
};

export const PublicNavLink = ({ href, label }: TProps) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-2.5 py-1 text-sm transition-colors",
        active
          ? "text-foreground decoration-primary underline decoration-2 underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
};
