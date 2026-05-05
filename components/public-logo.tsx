import Link from "next/link";
import { cn } from "@/lib/utils";

type TProps = {
  href?: string;
  className?: string;
};

export const PublicLogo = ({ href = "/", className }: TProps) => {
  return (
    <Link href={href} className={cn("flex shrink-0 items-center gap-2", className)}>
      <div className="flex size-[22px] shrink-0 items-center justify-center rounded-[4px] bg-violet-600">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="4.5" height="4.5" rx="1" fill="white" fillOpacity="0.9" />
          <rect x="7.5" y="1" width="4.5" height="4.5" rx="1" fill="white" fillOpacity="0.6" />
          <rect x="1" y="7.5" width="4.5" height="4.5" rx="1" fill="white" fillOpacity="0.6" />
          <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
      <span className="text-sm font-semibold tracking-tight">Utility Bills CRM</span>
    </Link>
  );
};
