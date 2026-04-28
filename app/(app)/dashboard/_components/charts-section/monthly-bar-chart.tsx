"use client";

import { useState } from "react";
import type { TDashboardData } from "../../_data/mock";
import { SERVICE_COLORS } from "../../_data/mock";

type TProps = {
  services: TDashboardData["charts"]["services"];
  months: string[];
};

const W = 560,
  H = 220,
  PAD_L = 38,
  PAD_R = 8,
  PAD_T = 8,
  PAD_B = 28;
const CHART_H = H - PAD_T - PAD_B;
const CHART_W = W - PAD_L - PAD_R;

export const MonthlyBarChart = ({ services, months }: TProps) => {
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const toggleSeries = (key: string) => {
    setHiddenSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleServices = services.filter((s) => !hiddenSeries[s.serviceKey]);

  const chartData = months.map((month, i) => ({
    month,
    parts: services.map((s) => ({ key: s.serviceKey, value: s.monthlyAmounts[i] ?? 0 })),
    visibleParts: visibleServices.map((s) => ({
      key: s.serviceKey,
      value: s.monthlyAmounts[i] ?? 0,
    })),
  }));

  const maxTotal = Math.max(
    ...chartData.map((d) => d.visibleParts.reduce((sum, p) => sum + p.value, 0)),
    1,
  );
  const yMax = Math.ceil(maxTotal / 500) * 500 || 500;
  const bw = CHART_W / months.length;
  const barInner = bw * 0.62;
  const yTicks = [0, yMax / 4, yMax / 2, (3 * yMax) / 4, yMax];

  return (
    <div
      className="rounded-lg border bg-white shadow transition-shadow duration-150 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none"
      style={{
        padding: 20,
        position: "relative",
      }}
    >
      <h3
        className="text-zinc-950 dark:text-zinc-50"
        style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}
      >
        Monthly expenses
      </h3>
      <p className="text-zinc-500" style={{ margin: "2px 0 0", fontSize: 12 }}>
        Stacked by service, UAH
      </p>

      <div style={{ position: "relative" }}>
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block", marginTop: 12 }}
          onMouseLeave={() => setHoveredBarIndex(null)}
        >
          {/* Y-axis grid + labels */}
          {yTicks.map((t, i) => {
            const y = PAD_T + CHART_H - (t / yMax) * CHART_H;
            const label = t >= 1000 ? `${(t / 1000).toFixed(1)}k` : String(t);
            return (
              <g key={i}>
                <line
                  x1={PAD_L}
                  x2={W - PAD_R}
                  y1={y}
                  y2={y}
                  stroke="#e4e4e7"
                  strokeDasharray={i === 0 ? "0" : "2 3"}
                />
                <text
                  x={PAD_L - 6}
                  y={y + 3}
                  fontSize="10"
                  fill="#71717a"
                  textAnchor="end"
                  fontFamily="inherit"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {chartData.map((d, i) => {
            const xCenter = PAD_L + i * bw + bw / 2;
            const x = xCenter - barInner / 2;
            let yCursor = PAD_T + CHART_H;
            const isHovered = hoveredBarIndex === i;

            return (
              <g key={i}>
                {/* invisible hit area for the full column */}
                <rect
                  x={PAD_L + i * bw}
                  y={PAD_T}
                  width={bw}
                  height={CHART_H}
                  fill="transparent"
                  onMouseEnter={() => setHoveredBarIndex(i)}
                />

                {d.visibleParts.map((p) => {
                  const ph = (p.value / yMax) * CHART_H;
                  yCursor -= ph;
                  return (
                    <rect
                      key={p.key}
                      x={x}
                      y={yCursor}
                      width={barInner}
                      height={ph}
                      fill={SERVICE_COLORS[p.key as keyof typeof SERVICE_COLORS]}
                      opacity={hoveredBarIndex == null || isHovered ? 1 : 0.45}
                      style={{ transition: "opacity 120ms", pointerEvents: "none" }}
                    />
                  );
                })}

                <text
                  x={xCenter}
                  y={H - PAD_B + 14}
                  fontSize="10.5"
                  fill={isHovered ? "#09090b" : "#71717a"}
                  fontWeight={isHovered ? 500 : 400}
                  textAnchor="middle"
                  fontFamily="inherit"
                  style={{ pointerEvents: "none" }}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredBarIndex != null &&
          (() => {
            const d = chartData[hoveredBarIndex];
            if (!d) return null;
            const xPct = ((PAD_L + hoveredBarIndex * bw + bw / 2) / W) * 100;
            const flipLeft = xPct > 72;
            const visibleTotal = d.visibleParts.reduce((sum, p) => sum + p.value, 0);

            return (
              <div
                className="border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                style={{
                  position: "absolute",
                  left: flipLeft ? `calc(${xPct}% - 16px)` : `calc(${xPct}% + 16px)`,
                  top: 20,
                  transform: flipLeft ? "translate(-100%, 0)" : "translate(0, 0)",
                  borderRadius: 6,
                  padding: "10px 12px",
                  minWidth: 200,
                  boxShadow:
                    "0 4px 8px -2px rgba(24,24,27,0.08), 0 2px 4px -2px rgba(24,24,27,0.05)",
                  pointerEvents: "none",
                  zIndex: 5,
                  fontSize: 12.5,
                }}
              >
                <div
                  className="border-b border-zinc-100 dark:border-zinc-700"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 8,
                    paddingBottom: 6,
                  }}
                >
                  {d.month}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {d.visibleParts.map((p) => {
                    const svc = services.find((s) => s.serviceKey === p.key);
                    return (
                      <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background: SERVICE_COLORS[p.key as keyof typeof SERVICE_COLORS],
                            flexShrink: 0,
                          }}
                        />
                        <span className="text-zinc-500 dark:text-zinc-400" style={{ flex: 1 }}>
                          {svc?.label ?? p.key}
                        </span>
                        <span
                          style={{
                            fontVariantNumeric: "tabular-nums",
                            fontFeatureSettings: '"tnum" 1',
                          }}
                        >
                          {p.value.toLocaleString("uk-UA")} UAH
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="border-t border-zinc-100 dark:border-zinc-700"
                  style={{
                    marginTop: 8,
                    paddingTop: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span className="text-zinc-500 dark:text-zinc-400" style={{ flex: 1 }}>
                    Total
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                      fontFeatureSettings: '"tnum" 1',
                    }}
                  >
                    {visibleTotal.toLocaleString("uk-UA")} UAH
                  </span>
                </div>
              </div>
            );
          })()}
      </div>

      {/* Clickable legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
        {services.map((s) => {
          const isHidden = !!hiddenSeries[s.serviceKey];
          return (
            <button
              key={s.serviceKey}
              onClick={() => toggleSeries(s.serviceKey)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 6px",
                fontSize: 11.5,
                color: isHidden ? "#71717a" : "#09090b",
                textDecoration: isHidden ? "line-through" : "none",
                background: "transparent",
                border: "1px solid transparent",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color 120ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: isHidden ? "#e4e4e7" : SERVICE_COLORS[s.serviceKey],
                  transition: "background 120ms",
                }}
              />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
