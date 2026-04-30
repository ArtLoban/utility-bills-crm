"use client";

import { useState } from "react";

import { ReadingModal } from "@/components/reading-modal";
import type { TMeter } from "@/components/reading-modal/types";
import { ACCENT } from "@/lib/constants/ui-tokens";

// devnote: replace with real meters list when Iteration 3 is implemented
const MOCK_METER_1ZONE: TMeter = {
  serialNumber: "012345",
  serviceKey: "electricity",
  propertyName: "Apartment on Main St",
  zones: 1,
  lastReadingValue: 12512,
  lastReadingDate: "Sep 14",
  unit: "kWh",
};

const MOCK_METER_2ZONE: TMeter = {
  serialNumber: "067890",
  serviceKey: "electricity",
  propertyName: "Apartment on Main St",
  zones: 2,
  lastReadingT1: 8010,
  lastReadingT2: 4502,
  lastReadingDate: "Sep 14",
  unit: "kWh",
  lastReadingValue: 8010 + 4502,
};

const MetersTabPlaceholder = () => {
  const [open1Zone, setOpen1Zone] = useState(false);
  const [open2Zone, setOpen2Zone] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-zinc-500">
      <p className="text-sm">Meters tab — coming soon</p>

      <div className="flex gap-3">
        <button
          onClick={() => setOpen1Zone(true)}
          className="cursor-pointer rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          style={{ height: 34 }}
        >
          Test 1-zone modal
        </button>
        <button
          onClick={() => setOpen2Zone(true)}
          className="cursor-pointer rounded-md border-0 text-sm font-medium text-white"
          style={{ height: 34, padding: "0 16px", background: ACCENT }}
        >
          Test 2-zone modal
        </button>
      </div>

      <ReadingModal open={open1Zone} onOpenChange={setOpen1Zone} meter={MOCK_METER_1ZONE} />
      <ReadingModal open={open2Zone} onOpenChange={setOpen2Zone} meter={MOCK_METER_2ZONE} />
    </div>
  );
};

export { MetersTabPlaceholder };
