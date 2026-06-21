import { cn } from "@/lib/utils";

export const tabNavItemClass = (isActive: boolean): string =>
  cn(
    "relative mr-6 inline-flex items-center gap-1.5 px-1 py-2.5 text-sm whitespace-nowrap no-underline transition-colors",
    isActive
      ? "text-foreground font-semibold"
      : "text-muted-foreground hover:text-foreground font-medium",
  );
