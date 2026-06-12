import { cn } from "@/lib/utils";
import { TServiceTypeCode } from "@/features/services/service-type";
import { IconBadge } from "@/components/icon-badge";
import { useServiceTypeMeta } from "@/features/services/hooks/use-service-type";

type TProps = {
  type: TServiceTypeCode;
  showLabel?: boolean;
  className?: string;
};

export const ServiceCell = ({ type, showLabel = true, className }: TProps) => {
  const { color, Icon: icon, label } = useServiceTypeMeta(type);

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={label}>
      <IconBadge icon={icon} color={color} size="xs" />
      {showLabel && <span>{label}</span>}
    </span>
  );
};
