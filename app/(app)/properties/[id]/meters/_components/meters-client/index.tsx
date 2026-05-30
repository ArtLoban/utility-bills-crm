"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import { ACCENT } from "@/lib/constants/ui-tokens";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TPropertyMeterRow } from "../../_data/queries";
import { MeterRow } from "./meter-row";

type TProps = {
  propertyId: string;
  meters: TPropertyMeterRow[];
  role: TPropertyRole;
};

const MetersClient = ({ propertyId, meters, role }: TProps) => {
  const router = useRouter();
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const canMutate = role === "owner" || role === "editor";

  const activeMeters = meters.filter((r) => r.meter.validTo === null);
  const historicalMeters = meters.filter((r) => r.meter.validTo !== null);

  return (
    <>
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <h1
          className="text-zinc-950 dark:text-zinc-50"
          style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: -0.5 }}
        >
          Meters
        </h1>
        {canMutate && (
          <button
            onClick={() => router.push(`/properties/${propertyId}/meters/new`)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-sm font-medium text-white"
            style={{ height: 36, padding: "0 14px", background: ACCENT }}
          >
            <Plus size={15} strokeWidth={2} />
            Add meter
          </button>
        )}
      </div>

      {/* Active meters */}
      {activeMeters.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
          No active meters. {canMutate ? "Add the first one." : ""}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {activeMeters.map((r) => (
            <MeterRow
              key={r.meter.id}
              meter={r.meter}
              serviceType={r.serviceType}
              propertyId={propertyId}
              canMutate={canMutate}
            />
          ))}
        </div>
      )}

      {/* Historical meters */}
      {historicalMeters.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <button
            onClick={() => setHistoryExpanded((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            style={{ padding: 0, marginBottom: historyExpanded ? 12 : 0 }}
          >
            {historyExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {historicalMeters.length} replaced meter
            {historicalMeters.length !== 1 ? "s" : ""}
          </button>

          {historyExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {historicalMeters.map((r) => (
                <MeterRow
                  key={r.meter.id}
                  meter={r.meter}
                  serviceType={r.serviceType}
                  propertyId={propertyId}
                  canMutate={false}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export { MetersClient };
