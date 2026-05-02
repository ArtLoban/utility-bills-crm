"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

const DESTRUCTIVE = "#dc2626";

const OverflowMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        style={{ width: 30, height: 30 }}
        aria-label="More options"
      >
        <MoreHorizontal size={15} className="text-zinc-500 dark:text-zinc-400" />
      </button>

      {open && (
        <div
          className="absolute right-0 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          style={{
            top: 34,
            minWidth: 160,
            borderRadius: 8,
            padding: 4,
            boxShadow: "0 8px 24px rgba(9,9,11,0.12)",
            zIndex: 50,
          }}
        >
          {/* devnote: wire to Edit details modal when designed */}
          <button
            onClick={() => setOpen(false)}
            className="block w-full cursor-pointer rounded-md border-0 bg-transparent text-left text-zinc-950 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
            style={{ padding: "8px 12px", fontSize: 13.5, fontFamily: "inherit" }}
          >
            Edit details
          </button>
          {/* devnote: wire to Remove meter confirmation dialog when designed */}
          <button
            onClick={() => setOpen(false)}
            className="block w-full cursor-pointer rounded-md border-0 bg-transparent text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
            style={{
              padding: "8px 12px",
              fontSize: 13.5,
              fontFamily: "inherit",
              color: DESTRUCTIVE,
            }}
          >
            Remove meter
          </button>
        </div>
      )}
    </div>
  );
};

export { OverflowMenu };
