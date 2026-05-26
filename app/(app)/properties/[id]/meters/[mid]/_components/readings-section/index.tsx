"use client";

import { useState } from "react";
import { Gauge, Plus } from "lucide-react";

import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import { SubmitReadingModal } from "@/features/readings/components/submit-reading-modal";
import { ReadingsTable } from "./readings-table";
import { ACCENT } from "@/lib/constants/ui-tokens";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  readings: TReading[];
  lastReading: TReading | null;
  role: TPropertyRole;
};

const ReadingsSection = ({
  meter,
  serviceType,
  propertyName,
  readings,
  lastReading,
  role,
}: TProps) => {
  const [submitOpen, setSubmitOpen] = useState(false);
  const canMutate = role !== "viewer";

  return (
    <>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="text-zinc-950 dark:text-zinc-50"
            style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}
          >
            Readings
          </h2>
          {canMutate && (
            <button
              onClick={() => setSubmitOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-sm font-medium text-white"
              style={{ height: 32, padding: "0 12px", background: ACCENT }}
            >
              <Plus size={13} />
              Submit reading
            </button>
          )}
        </div>

        {readings.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-[8px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30"
            style={{ padding: "40px 24px", textAlign: "center" }}
          >
            <Gauge size={28} className="text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No readings yet.</p>
            {canMutate && (
              <button
                onClick={() => setSubmitOpen(true)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                style={{ height: 30, padding: "0 12px" }}
              >
                <Plus size={13} />
                Submit first reading
              </button>
            )}
          </div>
        ) : (
          <ReadingsTable
            readings={readings}
            meter={meter}
            serviceType={serviceType}
            propertyName={propertyName}
            canMutate={canMutate}
          />
        )}
      </div>

      {canMutate && (
        <SubmitReadingModal
          open={submitOpen}
          onOpenChange={setSubmitOpen}
          meter={meter}
          serviceType={serviceType}
          propertyName={propertyName}
          lastReading={lastReading}
        />
      )}
    </>
  );
};

export { ReadingsSection };
