import { cn } from "@/lib/utils";
import { TServiceTypeCode } from "@/features/services/service-type";
import { IconBadge } from "@/components/icon-badge";
import { useServiceTypeMeta } from "@/features/services/hooks/use-service-type";

type TProps = {
  type: TServiceTypeCode;
  name?: string | null;
  showLabel?: boolean;
  className?: string;
};

export const ServiceCell = ({ type, name, showLabel = true, className }: TProps) => {
  const { color, Icon: icon, label: typeLabel } = useServiceTypeMeta(type);
  const label = name ?? typeLabel;

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={label}>
      <IconBadge icon={icon} color={color} size="xs" />
      {showLabel && <span>{label}</span>}
    </span>
  );
};
