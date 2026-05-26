import { Layers } from "lucide-react";

import {
  SERVICE_COLORS,
  dbCodeToServiceKey,
  getServiceLabel,
} from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";

type TService = { id: string; name: string };

type TProps = {
  service: TService;
  size?: "sm" | "default";
};

const ServiceBadge = ({ service, size = "default" }: TProps) => {
  const key = dbCodeToServiceKey(service.id);
  const color = key ? SERVICE_COLORS[key] : "#71717a";
  const Icon = key ? SERVICE_ICONS[key] : Layers;
  const label = service.name || getServiceLabel(service.id);

  const squareSize = size === "sm" ? 16 : 20;
  const iconSize = size === "sm" ? 10 : 12;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        style={{
          width: squareSize,
          height: squareSize,
          borderRadius: 4,
          background: color + "1A",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={iconSize} style={{ color }} strokeWidth={1.75} />
      </span>
      <span style={{ fontSize: 13.5 }}>{label}</span>
    </span>
  );
};

export { ServiceBadge };
