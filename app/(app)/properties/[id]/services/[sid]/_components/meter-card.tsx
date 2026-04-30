"use client";

import { useState } from "react";
import { Gauge } from "lucide-react";

import { ReadingModal } from "@/components/reading-modal";
import type { TMeter } from "@/components/reading-modal/types";
import { ACCENT } from "@/lib/constants/ui-tokens";
import { KVGrid } from "./kv-grid";
import type { TMeterInfo } from "../_data/mock";

type TProps = { meter: TMeterInfo; readingMeter: TMeter };

const MeterCard = ({ meter, readingMeter }: TProps) => {
  const [readingOpen, setReadingOpen] = useState(false);

  // devnote: consider lifting ReadingModal state to page level if sync needed
  return (
    <>
      <div
        className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <span
            className="text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1 }}
          >
            Meter
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReadingOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-[13px] font-medium text-white"
              style={{ height: 32, padding: "0 14px", background: ACCENT }}
            >
              <Gauge size={13} />
              Submit reading
            </button>
            {/* devnote: navigate to /properties/[id]/meters/[mid] when meter detail page is implemented */}
            <button
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent text-[13px] font-medium text-zinc-500"
              style={{ height: 32, padding: "0 10px" }}
            >
              View meter details
            </button>
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-5">
          <div style={{ marginBottom: 20 }}>
            <KVGrid
              pairs={[
                ["Serial number", meter.serialNumber],
                ["Type", meter.type],
                ["Installed", meter.installed],
                ["Last reading", meter.lastReadingDate],
              ]}
            />
          </div>

          <div className="flex gap-3">
            {meter.zones.map((zone) => (
              <div
                key={zone.label}
                className="flex flex-1 items-center justify-between"
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: zone.color + "0F",
                  border: `1px solid ${zone.color}25`,
                }}
              >
                <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12.5 }}>
                  {zone.label}
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      fontFeatureSettings: '"tnum" 1',
                      color: zone.color,
                    }}
                  >
                    {zone.value}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 11 }}>
                    {zone.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReadingModal open={readingOpen} onOpenChange={setReadingOpen} meter={readingMeter} />
    </>
  );
};

export { MeterCard };
