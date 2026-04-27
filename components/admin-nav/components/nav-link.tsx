import Link from "next/link";
import { cn } from "@/lib/utils";

type TProps = {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
};

export const NavLink = ({ href, label, active, onClick }: TProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "text-sm transition-colors",
      active
        ? "text-foreground underline decoration-amber-500 decoration-2 underline-offset-4"
        : "text-muted-foreground hover:text-foreground",
    )}
  >
    {label}
  </Link>
);
