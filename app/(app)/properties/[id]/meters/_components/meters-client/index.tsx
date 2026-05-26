"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import { ACCENT } from "@/lib/constants/ui-tokens";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TPropertyMeterRow } from "../../_data/queries";
import { AddMeterModal } from "../add-meter-modal";
import { ReplaceMeterModal } from "../replace-meter-modal";
import { MeterRow } from "./meter-row";

type TProps = {
  propertyId: string;
  meters: TPropertyMeterRow[];
  availableServiceTypes: TServiceType[];
  role: TPropertyRole;
};

const MetersClient = ({ propertyId, meters, availableServiceTypes, role }: TProps) => {
  const [addOpen, setAddOpen] = useState(false);
  const [replacingMeter, setReplacingMeter] = useState<TMeter | null>(null);
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
            onClick={() => setAddOpen(true)}
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
              onReplace={() => setReplacingMeter(r.meter)}
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

      <AddMeterModal
        open={addOpen}
        onOpenChange={setAddOpen}
        propertyId={propertyId}
        availableServiceTypes={availableServiceTypes}
      />

      {replacingMeter && (
        <ReplaceMeterModal
          open
          onOpenChange={(open) => {
            if (!open) setReplacingMeter(null);
          }}
          meter={replacingMeter}
        />
      )}
    </>
  );
};

export { MetersClient };
