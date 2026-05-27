import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

const ZONE_DESCRIPTIONS: Record<number, string> = {
  1: "Single zone",
  2: "Two zones (T1 day, T2 night)",
  3: "Three zones (T1 peak, T2 shoulder, T3 off-peak)",
};

const formatDate = (date: Date | null): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type TKVItem = {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
};

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
};

const DetailsCard = ({ meter, serviceType, propertyName }: TProps) => {
  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);

  const serviceLabel = serviceType.code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const items: TKVItem[] = [
    {
      label: "Service type",
      value: (
        <span className="inline-flex items-center" style={{ gap: 5 }}>
          <Icon size={14} style={{ color }} />
          {serviceLabel}
        </span>
      ),
    },
    { label: "Property", value: propertyName },
    {
      label: "Serial number",
      value: (
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
          {meter.serialNumber ?? "—"}
        </span>
      ),
    },
    {
      label: "Zones",
      value: ZONE_DESCRIPTIONS[meter.zoneCount] ?? `${meter.zoneCount} zones`,
    },
    { label: "Installed at", value: formatDate(meter.installedAt) },
    { label: "Active since", value: formatDate(meter.validFrom) },
    ...(meter.notes ? [{ label: "Notes", value: meter.notes, fullWidth: true }] : []),
  ];

  return (
    <div
      className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)", padding: "20px 24px" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 40px" }}>
        {items.map(({ label, value, fullWidth }) => (
          <div key={label} style={fullWidth ? { gridColumn: "1 / -1" } : {}}>
            <div
              className="text-zinc-500 dark:text-zinc-400"
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.3,
                marginBottom: 4,
              }}
            >
              {label}
            </div>
            <div
              className="text-zinc-950 dark:text-zinc-50"
              style={{ fontSize: 13.5, lineHeight: 1.4 }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { DetailsCard };
