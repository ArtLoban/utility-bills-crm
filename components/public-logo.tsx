import { Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

type TProps = {
  href?: string;
  className?: string;
};

export const PublicLogo = ({ href = ROUTES.home, className }: TProps) => {
  return (
    <Link href={href} className={cn("flex shrink-0 items-center gap-2", className)}>
      <div className="bg-primary flex size-5 shrink-0 items-center justify-center rounded">
        <Zap className="text-primary-foreground size-3" strokeWidth={1.75} />
      </div>
      <span className="text-sm font-semibold tracking-tight">UtilityBills Tracker</span>
    </Link>
  );
};
