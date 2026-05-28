import { getServiceLabel } from "@/lib/constants/service-colors";
import { getServiceTypeVisuals } from "@/features/services/service-type";
import type { TServiceTypeCode } from "@/features/services/service-type";

type TProps = { serviceId: string };

export const ServiceChip = ({ serviceId }: TProps) => {
  const { color, Icon } = getServiceTypeVisuals(serviceId as TServiceTypeCode);
  const label = getServiceLabel(serviceId);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px 2px 5px",
        background: color + "18",
        border: `1px solid ${color}2A`,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <Icon size={12} style={{ color }} strokeWidth={1.75} />
      {label}
    </span>
  );
};
