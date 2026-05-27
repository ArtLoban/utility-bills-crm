import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";
import { IconBadge } from "@/components/icon-badge";

type TProps = {
  type: TServiceTypeCode;
  showLabel?: boolean;
  className?: string;
};

export const ServiceCell = ({ type, showLabel = true, className }: TProps) => {
  const t = useTranslations("services.types");
  const { color, Icon: icon } = getServiceTypeVisuals(type);

  const label = t.has(type) ? t(type) : type;

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={label}>
      <IconBadge icon={icon} color={color} size="xs" />
      {showLabel && <span>{label}</span>}
    </span>
  );
};
