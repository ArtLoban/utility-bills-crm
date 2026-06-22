import { type ElementType } from "react";

const SIZE_MAP = {
  xs: { container: "h-5 w-5", icon: 12, rounded: "rounded" },
  sm: { container: "h-8 w-8", icon: 16, rounded: "rounded-md" },
  md: { container: "h-9 w-9", icon: 18, rounded: "rounded-lg" },
  lg: { container: "h-11 w-11", icon: 22, rounded: "rounded-lg" },
  xl: { container: "h-14 w-14", icon: 28, rounded: "rounded-lg" },
} as const;

type TProps = {
  icon: ElementType;
  color: string;
  size?: keyof typeof SIZE_MAP;
  border?: boolean;
};

export const IconBadge = ({ icon: Icon, color, size = "md", border }: TProps) => {
  const { container, icon: iconSize, rounded } = SIZE_MAP[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${rounded} ${container}`}
      style={{
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        ...(border && { border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }),
      }}
    >
      <Icon size={iconSize} strokeWidth={1.75} style={{ color }} />
    </div>
  );
};
