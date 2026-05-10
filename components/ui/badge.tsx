import { cn } from "@/lib/utils";

type TVariant = "default" | "outline";

type TProps = {
  children: React.ReactNode;
  variant?: TVariant;
  className?: string;
};

const Badge = ({ children, variant = "default", className }: TProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium",
      variant === "default" &&
        "border-transparent bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
      variant === "outline" && "border-current bg-transparent",
      className,
    )}
  >
    {children}
  </span>
);

export { Badge };
