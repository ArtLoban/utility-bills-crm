import { SERVICE_COLORS, SERVICE_LABELS, TServiceKey } from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";

type TProps = { serviceId: TServiceKey };

const ServiceChip = ({ serviceId }: TProps) => {
  const color = SERVICE_COLORS[serviceId];
  const Icon = SERVICE_ICONS[serviceId];

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
      {SERVICE_LABELS[serviceId]}
    </span>
  );
};

export { ServiceChip };
