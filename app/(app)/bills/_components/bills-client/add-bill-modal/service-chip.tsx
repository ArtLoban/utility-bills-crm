import { Layers } from "lucide-react";

import {
  SERVICE_COLORS,
  dbCodeToServiceKey,
  getServiceLabel,
} from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";

type TProps = { serviceId: string };

const ServiceChip = ({ serviceId }: TProps) => {
  const key = dbCodeToServiceKey(serviceId);
  const color = key ? SERVICE_COLORS[key] : "#71717a";
  const Icon = key ? SERVICE_ICONS[key] : Layers;
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

export { ServiceChip };
