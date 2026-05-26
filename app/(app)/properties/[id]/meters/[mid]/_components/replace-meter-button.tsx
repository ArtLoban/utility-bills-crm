"use client";

import { useState } from "react";

import type { TMeter } from "@/lib/db/schema/meters";
import { ReplaceMeterModal } from "../../_components/replace-meter-modal";

type TProps = { meter: TMeter };

const ReplaceMeterButton = ({ meter }: TProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center rounded-md border border-violet-100 bg-violet-50 text-sm font-medium text-violet-600 dark:border-violet-800/40 dark:bg-violet-950/40 dark:text-violet-400"
        style={{ height: 32, padding: "0 14px" }}
      >
        Replace meter
      </button>
      <ReplaceMeterModal open={open} onOpenChange={setOpen} meter={meter} />
    </>
  );
};

export { ReplaceMeterButton };
