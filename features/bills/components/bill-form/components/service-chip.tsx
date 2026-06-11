import { getServiceLabel } from "@/lib/constants/service-colors";
import { getServiceTypeVisuals } from "@/features/services/service-type";
import type { TServiceTypeCode } from "@/features/services/service-type";

type TProps = { serviceId: string };

export const ServiceChip = ({ serviceId }: TProps) => {
  const { color, Icon } = getServiceTypeVisuals(serviceId as TServiceTypeCode);
  const label = getServiceLabel(serviceId);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2 pl-[5px] text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 16%, transparent)`,
      }}
    >
      <Icon size={12} style={{ color }} strokeWidth={1.75} />
      {label}
    </span>
  );
};
