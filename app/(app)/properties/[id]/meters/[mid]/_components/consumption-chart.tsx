"use client";

import { useState } from "react";

import { ACCENT } from "@/lib/constants/ui-tokens";

import type { TReading } from "../_data/mock";

type TProps = { readings: TReading[] };

const T2_COLOR = "#a1a1aa";

const fmt = (n: number) => n.toLocaleString("en-US");

const formatLabel = (date: string) => date.replace(/ \d+,/, "").replace(/, (\d{4})$/, " $1");

const ConsumptionChart = ({ readings }: TProps) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const chartData = readings
    .slice()
    .reverse()
    .map((r) => ({ label: formatLabel(r.date), t1: r.t1, t2: r.t2 }));

  const VW = 800;
  const VH = 220;
  const pad = { top: 10, right: 48, bottom: 32, left: 10 };
  const iW = VW - pad.left - pad.right;
  const iH = VH - pad.top - pad.bottom;

  const n = chartData.length;
  const xStep = iW / (n - 1);
  const toX = (i: number) => pad.left + i * xStep;

  const allVals = chartData.flatMap((d) => [d.t1, d.t2]);
  const minV = Math.floor(Math.min(...allVals) / 500) * 500;
  const maxV = Math.ceil(Math.max(...allVals) / 1000) * 1000;
  const toY = (v: number) => pad.top + iH - ((v - minV) / (maxV - minV)) * iH;

  const pts = (key: "t1" | "t2") =>
    chartData.map((d, i) => `${toX(i).toFixed(1)},${toY(d[key]).toFixed(1)}`).join(" ");

  const yTickVals = Array.from({ length: 5 }, (_, i) => minV + ((maxV - minV) * i) / 4);

  return (
    <div
      className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      style={{ padding: "20px 24px 16px", boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
    >
      {/* Legend */}
      <div className="mb-3.5 flex gap-5">
        {[
          { color: ACCENT, label: "T1 (day)", dashed: false },
          { color: T2_COLOR, label: "T2 (night)", dashed: true },
        ].map(({ color, label, dashed }) => (
          <div key={label} className="flex items-center gap-1.5">
            <svg width="22" height="10" style={{ flexShrink: 0 }}>
              <line
                x1="0"
                y1="5"
                x2="22"
                y2="5"
                stroke={color}
                strokeWidth="2"
                strokeDasharray={dashed ? "4 2" : undefined}
              />
              <circle cx="11" cy="5" r="3" fill={color} />
            </svg>
            <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12.5 }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          style={{ width: "100%", display: "block", overflow: "visible" }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* Grid lines + Y labels */}
          {yTickVals.map((v, i) => (
            <g key={i}>
              <line
                x1={pad.left}
                y1={toY(v).toFixed(1)}
                x2={VW - pad.right}
                y2={toY(v).toFixed(1)}
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth="1"
              />
              <text
                x={VW - pad.right + 6}
                y={toY(v) + 4}
                fontSize="10.5"
                className="fill-zinc-400 dark:fill-zinc-500"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              </text>
            </g>
          ))}

          {/* T2 line (dashed) */}
          <polyline
            points={pts("t2")}
            fill="none"
            stroke={T2_COLOR}
            strokeWidth="2"
            strokeDasharray="4 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* T1 line (solid) */}
          <polyline
            points={pts("t1")}
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {chartData.map((d, i) => (
            <g key={i}>
              <circle
                cx={toX(i)}
                cy={toY(d.t1)}
                r={hoverIdx === i ? 5 : 3.5}
                fill={ACCENT}
                style={{ transition: "r 100ms" }}
              />
              <circle
                cx={toX(i)}
                cy={toY(d.t2)}
                r={hoverIdx === i ? 5 : 3.5}
                fill={T2_COLOR}
                style={{ transition: "r 100ms" }}
              />
            </g>
          ))}

          {/* Guide line on hover */}
          {hoverIdx !== null && (
            <line
              x1={toX(hoverIdx)}
              y1={pad.top}
              x2={toX(hoverIdx)}
              y2={pad.top + iH}
              className="stroke-zinc-300 dark:stroke-zinc-700"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          )}

          {/* Hit strips */}
          {chartData.map((_, i) => (
            <rect
              key={i}
              x={i === 0 ? toX(i) - xStep * 0.4 : toX(i) - xStep / 2}
              y={pad.top}
              width={xStep}
              height={iH + 24}
              fill="transparent"
              style={{ cursor: "default" }}
              onMouseEnter={() => setHoverIdx(i)}
            />
          ))}

          {/* X-axis labels */}
          {chartData.map((d, i) => (
            <text
              key={i}
              x={toX(i)}
              y={VH - 4}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight={hoverIdx === i ? "500" : "400"}
              fontFamily="Inter, system-ui, sans-serif"
              className={
                hoverIdx === i
                  ? "fill-zinc-950 dark:fill-zinc-50"
                  : "fill-zinc-400 dark:fill-zinc-500"
              }
            >
              {d.label}
            </text>
          ))}
        </svg>

        {/* Floating tooltip */}
        {hoverIdx !== null &&
          (() => {
            const d = chartData[hoverIdx];
            if (d === undefined) return null;
            const xPct = (toX(hoverIdx) / VW) * 100;
            const alignRight = hoverIdx > n / 2;
            return (
              <div
                className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                style={{
                  position: "absolute",
                  top: 0,
                  left: alignRight ? "auto" : `calc(${xPct}% + 14px)`,
                  right: alignRight ? `calc(${100 - xPct}% + 14px)` : "auto",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  boxShadow: "0 4px 16px rgba(9,9,11,0.1)",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                }}
              >
                <div
                  className="text-zinc-950 dark:text-zinc-50"
                  style={{ fontWeight: 600, marginBottom: 7 }}
                >
                  {d.label}
                </div>
                {[
                  { color: ACCENT, label: "T1 (day)", val: d.t1 },
                  { color: T2_COLOR, label: "T2 (night)", val: d.t2 },
                ].map(({ color, label, val }) => (
                  <div key={label} className="mb-1 flex items-center gap-2">
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    <span className="text-zinc-500 dark:text-zinc-400">{label}:</span>
                    <span
                      className="text-zinc-950 dark:text-zinc-50"
                      style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}
                    >
                      {fmt(val)} kWh
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export { ConsumptionChart };
