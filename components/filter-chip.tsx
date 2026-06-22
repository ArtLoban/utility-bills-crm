import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TProps = {
  label: string;
  icon: LucideIcon;
  color?: string;
  onRemove: () => void;
};

export const FilterChip = ({
  label,
  icon: Icon,
  color = "var(--muted-foreground)",
  onRemove,
}: TProps) => (
  <Badge
    asChild
    variant="outline"
    className="focus-visible:ring-ring h-6 cursor-pointer gap-1.5 rounded-full transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
    style={{
      background: `color-mix(in srgb, ${color} 10%, transparent)`,
      borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
    }}
  >
    <button type="button" onClick={onRemove} aria-label={`Remove filter: ${label}`}>
      <Icon strokeWidth={1.75} style={{ color }} />
      {label}
    </button>
  </Badge>
);
