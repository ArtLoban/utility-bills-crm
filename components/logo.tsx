import { Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

type TProps = {
  href?: string;
  className?: string;
};

export const Logo = ({ href = ROUTES.home, className }: TProps) => {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary flex size-7 items-center justify-center rounded-sm">
        <Zap className="text-primary-foreground size-4" strokeWidth={1.75} />
      </div>
      <span className="text-md font-bold">UtilityBills CRM</span>
    </Link>
  );
};
