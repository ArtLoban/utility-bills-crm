import { Droplets, Flame, Thermometer, Wifi, Zap } from "lucide-react";

import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { TBillService } from "@/app/(app)/bills/_data/mock";

type TProps = {
  service: TBillService;
  size?: "sm" | "default";
};

const ICON_MAP: Record<string, React.ElementType> = {
  electricity: Zap,
  gas: Flame,
  coldWater: Droplets,
  hotWater: Droplets,
  heating: Thermometer,
  internet: Wifi,
};

const ServiceBadge = ({ service, size = "default" }: TProps) => {
  const color = SERVICE_COLORS[service.id];
  const Icon = ICON_MAP[service.id] ?? Zap;

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
      <span style={{ fontSize: 13.5 }}>{service.name}</span>
    </span>
  );
};

export { ServiceBadge };
