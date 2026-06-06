import { Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TProps = {
  href?: string;
  className?: string;
};

export const Logo = ({ href = "/", className }: TProps) => {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <div className="flex size-7 items-center justify-center rounded-sm bg-violet-600">
        <Zap className="size-4 text-white" strokeWidth={1.75} />
      </div>
      <span className="text-md font-bold">UtilityBills CRM</span>
    </Link>
  );
};
