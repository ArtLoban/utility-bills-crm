import { Zap } from "lucide-react";

import { ACCENT } from "@/lib/constants/ui-tokens";

import type { TMeterDetail } from "../_data/mock";

type TKVItem = {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
};

type TProps = { meter: TMeterDetail };

const DetailsCard = ({ meter }: TProps) => {
  const items: TKVItem[] = [
    {
      label: "Service type",
      value: (
        <span className="inline-flex items-center" style={{ gap: 5 }}>
          <Zap size={14} style={{ color: ACCENT }} />
          Electricity
        </span>
      ),
    },
    { label: "Property", value: meter.propertyName },
    {
      label: "Serial number",
      value: (
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
          {meter.serialNumber}
        </span>
      ),
    },
    { label: "Zones", value: `${meter.zones} (${meter.zoneLabels})` },
    { label: "Installed at", value: meter.installedAt },
    { label: "Active since", value: meter.activeSince },
    { label: "Notes", value: meter.notes, fullWidth: true },
  ];

  return (
    <div
      className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)", padding: "20px 24px" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px 40px",
        }}
      >
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
