import { SERVICE_COLORS, SERVICE_LABELS } from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";
import type { TMeter } from "../types";

type TProps = {
  meter: TMeter;
};

const MeterContext = ({ meter }: TProps) => {
  const color = SERVICE_COLORS[meter.serviceKey];
  const Icon = SERVICE_ICONS[meter.serviceKey];
  const label = SERVICE_LABELS[meter.serviceKey];

  return (
    <div className="mb-5 flex items-center gap-3 rounded-lg bg-zinc-100 px-3.5 py-3 dark:bg-zinc-800">
      {/* background uses color + "1A" — dynamic hex opacity, can't be a Tailwind class */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: color + "1A" }}
      >
        <Icon size={18} style={{ color }} strokeWidth={1.75} />
      </div>
      <div>
        <div className="text-sm font-semibold tracking-[-0.1px] text-zinc-950 dark:text-zinc-50">
          {label} meter · SN {meter.serialNumber}
          {meter.zones === 2 && (
            <span className="font-normal text-zinc-500 dark:text-zinc-400">{" · 2 zones"}</span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{meter.propertyName}</div>
      </div>
    </div>
  );
};

export { MeterContext };
