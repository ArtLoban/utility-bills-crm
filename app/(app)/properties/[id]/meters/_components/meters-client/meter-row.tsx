import Link from "next/link";

import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";
import type { TMeterListItem } from "../../_data/mock";

type TProps = {
  meter: TMeterListItem;
  propertyId: string;
};

const MeterRow = ({ meter, propertyId }: TProps) => {
  const Icon = SERVICE_ICONS[meter.serviceKey];
  const color = SERVICE_COLORS[meter.serviceKey];

  return (
    <Link
      href={`/properties/${propertyId}/meters/${meter.id}`}
      className="group flex items-center gap-3.5 rounded-lg border border-zinc-200 bg-white px-5 py-4 no-underline transition-shadow duration-[150ms] hover:shadow-[0_4px_8px_-2px_rgba(24,24,27,0.08),0_2px_4px_-2px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900"
      style={{ display: "flex" }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-lg"
        style={{ width: 36, height: 36, background: `${color}1A` }}
      >
        <Icon size={18} style={{ color }} strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="font-medium text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, marginBottom: 2 }}
        >
          {meter.serviceName}
        </p>
        <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
          {meter.zonesLabel}
          <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>
          <span style={{ fontFamily: "ui-monospace, monospace" }}>{meter.serialNumber}</span>
        </p>
      </div>
    </Link>
  );
};

export { MeterRow };
