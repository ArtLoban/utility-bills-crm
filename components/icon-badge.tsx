import { type ElementType } from "react";

import { cn } from "@/lib/utils";

const SIZE_MAP = {
  xs: { container: "size-5", icon: 12, rounded: "rounded" },
  sm: { container: "size-8", icon: 16, rounded: "rounded-md" },
  md: { container: "size-9", icon: 18, rounded: "rounded-lg" },
  lg: { container: "size-11", icon: 22, rounded: "rounded-lg" },
  xl: { container: "size-14", icon: 28, rounded: "rounded-lg" },
} as const;

type TProps = {
  icon: ElementType;
  color: string;
  size?: keyof typeof SIZE_MAP;
  border?: boolean;
  className?: string;
};

export const IconBadge = ({ icon: Icon, color, size = "md", border, className }: TProps) => {
  const { container, icon: iconSize, rounded } = SIZE_MAP[size];

  return (
    <div
      className={cn("flex shrink-0 items-center justify-center", rounded, container, className)}
      style={{
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        ...(border && { border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }),
      }}
    >
      <Icon size={iconSize} strokeWidth={1.75} style={{ color }} />
    </div>
  );
};
