"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { ACCENT } from "@/lib/constants/ui-tokens";
import type { TMeterListItem } from "../../_data/mock";
import { AddMeterModal } from "../add-meter-modal";
import { MeterRow } from "./meter-row";

type TProps = {
  propertyId: string;
  meters: TMeterListItem[];
};

const MetersClient = ({ propertyId, meters }: TProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <h1
          className="text-zinc-950 dark:text-zinc-50"
          style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: -0.5 }}
        >
          Meters
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-[13.5px] font-medium text-white"
          style={{ height: 36, padding: "0 14px", background: ACCENT }}
        >
          <Plus size={15} strokeWidth={2} />
          Add meter
        </button>
      </div>

      {meters.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
          No meters yet. Add the first one.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {meters.map((m) => (
            <MeterRow key={m.id} meter={m} propertyId={propertyId} />
          ))}
        </div>
      )}

      <AddMeterModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export { MetersClient };
