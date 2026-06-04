import { Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TProps = {
  href?: string;
  className?: string;
};

export const PublicLogo = ({ href = "/", className }: TProps) => {
  return (
    <Link href={href} className={cn("flex shrink-0 items-center gap-2", className)}>
      <div className="flex size-5 shrink-0 items-center justify-center rounded bg-violet-600">
        <Zap className="size-3 text-white" strokeWidth={1.75} />
      </div>
      <span className="text-sm font-semibold tracking-tight">Utility Bills CRM</span>
    </Link>
  );
};
