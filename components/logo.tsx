import { Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// [DevNote] type TProps
type TLogoProps = {
  href?: string;
  className?: string;
};

// // [DevNote] WHy not FC<TProps>??
export const Logo = ({ href = "/", className }: TLogoProps) => {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <div className="flex size-7 items-center justify-center rounded-[7px] bg-violet-600">
        <Zap className="size-[15px] text-white" strokeWidth={1.75} />
      </div>
      <span className="text-[15px] font-bold tracking-[-0.2px]">UtilityBills</span>
    </Link>
  );
};
