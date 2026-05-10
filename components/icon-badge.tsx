import { type ElementType } from "react";

const SIZE_MAP = {
  xs: { container: "h-5 w-5", icon: 12, rounded: "rounded" },
  sm: { container: "h-8 w-8", icon: 16, rounded: "rounded-md" },
  md: { container: "h-9 w-9", icon: 18, rounded: "rounded-lg" },
} as const;

type TProps = {
  icon: ElementType;
  color: string;
  size?: keyof typeof SIZE_MAP;
};

export const IconBadge = ({ icon: Icon, color, size = "md" }: TProps) => {
  const { container, icon: iconSize, rounded } = SIZE_MAP[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${rounded} ${container}`}
      style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}
    >
      <Icon size={iconSize} strokeWidth={1.75} style={{ color }} />
    </div>
  );
};
