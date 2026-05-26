import Link from "next/link";
import { Gauge } from "lucide-react";

import type { TMeter } from "@/lib/db/schema/meters";

type TProps = {
  meter: TMeter | null;
  propertyId: string;
};

const formatDate = (date: Date | null): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ZONE_LABELS: Record<number, string> = {
  1: "Single zone",
  2: "Two zones (T1/T2)",
  3: "Three zones (T1/T2/T3)",
};

const MeterCard = ({ meter, propertyId }: TProps) => (
  <div
    className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
  >
    <div className="flex items-center border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
      <span
        className="text-zinc-950 dark:text-zinc-50"
        style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1 }}
      >
        Meter
      </span>
    </div>

    {meter === null ? (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
        <Gauge size={28} className="text-zinc-300 dark:text-zinc-600" />
        <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
          No meter linked yet.
        </p>
      </div>
    ) : (
      <div className="px-5 py-4">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
          <div>
            <p
              className="text-zinc-500 dark:text-zinc-400"
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.3,
                marginBottom: 3,
              }}
            >
              Serial number
            </p>
            <p
              className="text-zinc-950 dark:text-zinc-50"
              style={{ fontSize: 13.5, fontFamily: "ui-monospace, monospace" }}
            >
              {meter.serialNumber ?? "—"}
            </p>
          </div>

          <div>
            <p
              className="text-zinc-500 dark:text-zinc-400"
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.3,
                marginBottom: 3,
              }}
            >
              Zones
            </p>
            <p className="text-zinc-950 dark:text-zinc-50" style={{ fontSize: 13.5 }}>
              {ZONE_LABELS[meter.zoneCount] ?? `${meter.zoneCount} zones`}
            </p>
          </div>

          <div>
            <p
              className="text-zinc-500 dark:text-zinc-400"
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.3,
                marginBottom: 3,
              }}
            >
              Active since
            </p>
            <p className="text-zinc-950 dark:text-zinc-50" style={{ fontSize: 13.5 }}>
              {formatDate(meter.validFrom)}
            </p>
          </div>

          <div>
            <p
              className="text-zinc-500 dark:text-zinc-400"
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.3,
                marginBottom: 3,
              }}
            >
              Installed at
            </p>
            <p className="text-zinc-950 dark:text-zinc-50" style={{ fontSize: 13.5 }}>
              {formatDate(meter.installedAt)}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <Link
            href={`/properties/${propertyId}/meters/${meter.id}`}
            className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            View meter details →
          </Link>
        </div>
      </div>
    )}
  </div>
);

export { MeterCard };
