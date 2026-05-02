"use client";

import { useState } from "react";
import { Gauge, Pencil } from "lucide-react";

import { ReadingModal } from "@/components/reading-modal";
import { ACCENT } from "@/lib/constants/ui-tokens";
import type { TMeter } from "@/components/reading-modal/types";

import type { TReading } from "../_data/mock";

type TProps = {
  readings: TReading[];
  readingMeter: TMeter;
};

const fmt = (n: number) => n.toLocaleString("en-US");

const TABLE_COLS = ["Date", "T1 (day)", "T2 (night)", "Δ T1", "Δ T2", "Notes", ""];

const ReadingsSection = ({ readings, readingMeter }: TProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <>
      {/* Section header */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="text-zinc-950 dark:text-zinc-50"
            style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}
          >
            Readings
          </h2>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-[13px] font-medium text-white"
            style={{
              height: 32,
              padding: "0 14px",
              background: ACCENT,
              boxShadow: "0 1px 3px rgba(124,58,237,0.2)",
            }}
          >
            <Gauge size={13} />
            Submit reading
          </button>
        </div>

        {/* Desktop table */}
        <div
          className="hidden rounded-[8px] border border-zinc-200 sm:block dark:border-zinc-800"
          style={{ overflow: "hidden", boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                {TABLE_COLS.map((col, i) => (
                  <th
                    key={i}
                    className="text-zinc-500 dark:text-zinc-400"
                    style={{
                      padding: "10px 16px",
                      textAlign: i >= 1 && i <= 4 ? "right" : "left",
                      fontSize: 11.5,
                      fontWeight: 500,
                      letterSpacing: 0.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {readings.map((row, i) => {
                const isLast = i === readings.length - 1;
                const hovered = hoveredRow === i;
                return (
                  <tr
                    key={i}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800"}
                    style={{
                      background: hovered ? "var(--row-hover)" : "transparent",
                      transition: "background 100ms",
                    }}
                  >
                    <td
                      className="text-zinc-950 dark:text-zinc-50"
                      style={{ padding: "11px 16px", whiteSpace: "nowrap" }}
                    >
                      {row.date}
                    </td>
                    <td
                      className="text-zinc-950 dark:text-zinc-50"
                      style={{
                        padding: "11px 16px",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 500,
                      }}
                    >
                      {fmt(row.t1)}
                      <span
                        className="text-zinc-500 dark:text-zinc-400"
                        style={{ fontSize: 11.5, fontWeight: 400 }}
                      >
                        {" "}
                        kWh
                      </span>
                    </td>
                    <td
                      className="text-zinc-950 dark:text-zinc-50"
                      style={{
                        padding: "11px 16px",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 500,
                      }}
                    >
                      {fmt(row.t2)}
                      <span
                        className="text-zinc-500 dark:text-zinc-400"
                        style={{ fontSize: 11.5, fontWeight: 400 }}
                      >
                        {" "}
                        kWh
                      </span>
                    </td>
                    <td
                      className="text-zinc-500 dark:text-zinc-400"
                      style={{
                        padding: "11px 16px",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 13,
                      }}
                    >
                      {row.d1 !== null ? (
                        `+${fmt(row.d1)}`
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700">—</span>
                      )}
                    </td>
                    <td
                      className="text-zinc-500 dark:text-zinc-400"
                      style={{
                        padding: "11px 16px",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 13,
                      }}
                    >
                      {row.d2 !== null ? (
                        `+${fmt(row.d2)}`
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700">—</span>
                      )}
                    </td>
                    <td
                      className="text-zinc-500 dark:text-zinc-400"
                      style={{
                        padding: "11px 16px",
                        fontSize: 13,
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.note || <span className="text-zinc-300 dark:text-zinc-700">—</span>}
                    </td>
                    <td style={{ padding: "11px 12px 11px 4px", width: 36 }}>
                      {/* devnote: wire to edit reading modal when designed */}
                      <button
                        className="flex cursor-pointer items-center justify-center rounded-md border-0 bg-transparent"
                        style={{
                          width: 26,
                          height: 26,
                          color: hovered ? "inherit" : "transparent",
                          transition: "color 120ms",
                        }}
                      >
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col gap-2 sm:hidden">
          {readings.map((row, i) => (
            <div
              key={i}
              className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              style={{ padding: "14px 16px", boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
            >
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-zinc-950 dark:text-zinc-50">
                  {row.date}
                </span>
                {/* devnote: wire to edit reading modal when designed */}
                <button className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-zinc-500 dark:text-zinc-400">
                  <Pencil size={13} />
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: "T1 (day)", value: row.t1, delta: row.d1 },
                  { label: "T2 (night)", value: row.t2, delta: row.d2 },
                ].map(({ label, value, delta }) => (
                  <div key={label} className="flex items-baseline justify-between">
                    <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400">{label}</span>
                    <span
                      className="text-zinc-950 dark:text-zinc-50"
                      style={{
                        fontSize: 13.5,
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 500,
                      }}
                    >
                      {fmt(value)} kWh
                      {delta !== null && (
                        <span className="ml-1 text-[12px] font-normal text-zinc-500 dark:text-zinc-400">
                          +{fmt(delta)}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {row.note && (
                  <p className="mt-1 text-[12.5px] text-zinc-500 dark:text-zinc-400">{row.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReadingModal open={modalOpen} onOpenChange={setModalOpen} meter={readingMeter} />

      {/* CSS variable for row hover — avoids JS-driven inline style per-row in dark mode */}
      <style>{`
        :root { --row-hover: #fafafa; }
        .dark { --row-hover: #27272a; }
      `}</style>
    </>
  );
};

export { ReadingsSection };
