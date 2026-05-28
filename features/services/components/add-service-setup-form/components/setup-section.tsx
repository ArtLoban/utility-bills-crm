import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TProps = {
  n: number;
  title: string;
  desc: string;
  inactive?: boolean;
  accent?: string;
  children: ReactNode;
};

export const FormSection = ({ n, title, desc, inactive = false, accent, children }: TProps) => {
  const badgeStyle = inactive
    ? undefined
    : accent
      ? {
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          color: accent,
        }
      : undefined;

  return (
    <section className="bg-card overflow-hidden rounded-lg border">
      <div className="flex items-start gap-3.5 px-7 py-5">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[13px] font-semibold",
            inactive
              ? "bg-muted text-muted-foreground border"
              : accent
                ? ""
                : "border-primary/30 bg-primary/10 text-primary",
          )}
          style={badgeStyle}
        >
          {String(n).padStart(2, "0")}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">{desc}</p>
        </div>
      </div>

      <div className="bg-border mx-7 h-px" />

      <div className={cn("px-7 py-5", inactive && "pointer-events-none opacity-45")}>
        {children}
      </div>
    </section>
  );
};
