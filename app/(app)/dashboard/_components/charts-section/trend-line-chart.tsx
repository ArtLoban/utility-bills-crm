"use client";

import { useState } from "react";
import type { TDashboardData } from "../../_data/mock";
import { SERVICE_COLORS } from "../../_data/mock";

type TProps = {
  services: TDashboardData["charts"]["services"];
  months: string[];
};

type TMode = "expenses" | "consumption";
type TMeteredKey = "electricity" | "gas" | "coldWater" | "hotWater";

const CONSUMPTION_RATES: Record<TMeteredKey, { divisor: number; unit: string; decimals: number }> =
  {
    electricity: { divisor: 4.8, unit: "kWh", decimals: 0 },
    gas: { divisor: 8, unit: "m³", decimals: 0 },
    coldWater: { divisor: 35, unit: "m³", decimals: 1 },
    hotWater: { divisor: 110, unit: "m³", decimals: 1 },
  };

const METERED_KEYS: TMeteredKey[] = ["electricity", "gas", "coldWater", "hotWater"];

const W = 1100,
  H = 240,
  PAD_L = 44,
  PAD_R = 20,
  PAD_T = 12,
  PAD_B = 28;
const CHART_H = H - PAD_T - PAD_B;
const CHART_W = W - PAD_L - PAD_R;

export const TrendLineChart = ({ services, months }: TProps) => {
  const [mode, setMode] = useState<TMode>("expenses");
  const [selectedService, setSelectedService] = useState<TMeteredKey>("electricity");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const expenseSeries = services.filter((s) => METERED_KEYS.includes(s.serviceKey as TMeteredKey));

  const activeSeries =
    mode === "expenses"
      ? expenseSeries.map((s) => ({
          key: s.serviceKey,
          label: s.label,
          color: SERVICE_COLORS[s.serviceKey],
          values: s.monthlyAmounts,
        }))
      : (() => {
          const svc = services.find((s) => s.serviceKey === selectedService);
          if (!svc) return [];
          const rate = CONSUMPTION_RATES[selectedService];
          return [
            {
              key: selectedService,
              label: svc.label,
              color: SERVICE_COLORS[selectedService],
              values: svc.monthlyAmounts.map((v) =>
                Number((v / rate.divisor).toFixed(rate.decimals)),
              ),
            },
          ];
        })();

  const allValues = activeSeries.flatMap((s) => s.values);
  const maxVal = Math.max(...allValues, 1);
  const yMax = Math.ceil(maxVal / 100) * 100;
  const yTicks = [0, yMax / 4, yMax / 2, (3 * yMax) / 4, yMax];

  const xAt = (i: number) => PAD_L + (i / (months.length - 1)) * CHART_W;
  const yAt = (v: number) => PAD_T + CHART_H - (v / yMax) * CHART_H;

  const subtitleText =
    mode === "expenses"
      ? "All services, UAH"
      : `${activeSeries[0]?.label ?? ""}, ${CONSUMPTION_RATES[selectedService].unit}`;

  // Tooltip: strip width centered on each point
  const step = CHART_W / (months.length - 1);

  const tooltipUnit = mode === "expenses" ? "UAH" : CONSUMPTION_RATES[selectedService].unit;

  return (
    <div
      className="rounded-lg border bg-white shadow transition-shadow duration-150 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none"
      style={{
        padding: 20,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 4,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3
            className="text-zinc-950 dark:text-zinc-50"
            style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}
          >
            Consumption trend
          </h3>
          <p className="text-zinc-500" style={{ margin: "2px 0 0", fontSize: 12 }}>
            {subtitleText}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Segmented toggle */}
          <div
            className="border dark:border-zinc-700"
            style={{
              display: "inline-flex",
              padding: 3,
              background: "#f4f4f5",
              borderRadius: 6,
            }}
          >
            {(
              [
                { k: "expenses" as TMode, label: "Expenses (₴)" },
                { k: "consumption" as TMode, label: "Consumption" },
              ] as const
            ).map((tab) => {
              const isActive = mode === tab.k;
              return (
                <button
                  key={tab.k}
                  onClick={() => setMode(tab.k)}
                  style={{
                    padding: "5px 12px",
                    fontSize: 12.5,
                    fontWeight: isActive ? 500 : 400,
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    background: isActive ? "#ffffff" : "transparent",
                    color: isActive ? "#09090b" : "#71717a",
                    boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                    fontFamily: "inherit",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Service selector — consumption mode only */}
          {mode === "consumption" && (
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value as TMeteredKey)}
              className="border dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              style={{
                height: 32,
                padding: "0 8px",
                fontSize: 13,
                borderRadius: 6,
                fontFamily: "inherit",
                cursor: "pointer",
                minWidth: 140,
              }}
            >
              {METERED_KEYS.map((key) => {
                const svc = services.find((s) => s.serviceKey === key);
                return (
                  <option key={key} value={key}>
                    {svc?.label ?? key}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      </div>

      {/* Chart wrapper — needed for HTML tooltip overlay */}
      <div style={{ position: "relative" }}>
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block", marginTop: 8 }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Grid + Y labels */}
          {yTicks.map((t, i) => {
            const y = yAt(t);
            const label =
              mode === "expenses"
                ? t >= 1000
                  ? `${(t / 1000).toFixed(1)}k`
                  : String(t)
                : Number.isInteger(t)
                  ? String(t)
                  : t.toFixed(1);
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
                  x={PAD_L - 8}
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

          {/* X labels */}
          {months.map((m, i) => (
            <text
              key={m}
              x={xAt(i)}
              y={H - PAD_B + 14}
              fontSize="10.5"
              fill={hoveredIndex === i ? "#09090b" : "#71717a"}
              fontWeight={hoveredIndex === i ? 500 : 400}
              textAnchor="middle"
              fontFamily="inherit"
              style={{ pointerEvents: "none" }}
            >
              {m}
            </text>
          ))}

          {/* Vertical guide line */}
          {hoveredIndex !== null && (
            <line
              x1={xAt(hoveredIndex)}
              x2={xAt(hoveredIndex)}
              y1={PAD_T}
              y2={PAD_T + CHART_H}
              stroke="#e4e4e7"
              strokeWidth="1"
              strokeDasharray="3 3"
              style={{ pointerEvents: "none" }}
            />
          )}

          {/* Lines + dots */}
          {activeSeries.map((s) => {
            const d = s.values
              .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(2)} ${yAt(v).toFixed(2)}`)
              .join(" ");
            return (
              <g key={s.key}>
                <path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pointerEvents: "none" }}
                />
                {s.values.map((v, i) => {
                  const isHovered = hoveredIndex === i;
                  return (
                    <circle
                      key={i}
                      cx={xAt(i)}
                      cy={yAt(v)}
                      r={isHovered ? 4 : 2.5}
                      fill={isHovered ? s.color : "#fff"}
                      stroke={s.color}
                      strokeWidth="1.5"
                      style={{ pointerEvents: "none", transition: "r 80ms" }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Invisible hit strips per month */}
          {months.map((_, i) => (
            <rect
              key={i}
              x={xAt(i) - step / 2}
              y={PAD_T}
              width={step}
              height={CHART_H}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null &&
          (() => {
            const xPct = (xAt(hoveredIndex) / W) * 100;
            const flipLeft = xPct > 72;

            return (
              <div
                className="border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                style={{
                  position: "absolute",
                  left: flipLeft ? `calc(${xPct}% - 16px)` : `calc(${xPct}% + 16px)`,
                  top: 16,
                  transform: flipLeft ? "translate(-100%, 0)" : "translate(0, 0)",
                  borderRadius: 6,
                  padding: "10px 12px",
                  minWidth: 180,
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
                  {months[hoveredIndex]}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {activeSeries.map((s) => {
                    const value = s.values[hoveredIndex] ?? 0;
                    return (
                      <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background: s.color,
                            flexShrink: 0,
                          }}
                        />
                        <span className="text-zinc-500 dark:text-zinc-400" style={{ flex: 1 }}>
                          {s.label}
                        </span>
                        <span
                          style={{
                            fontVariantNumeric: "tabular-nums",
                            fontFeatureSettings: '"tnum" 1',
                          }}
                        >
                          {value.toLocaleString("uk-UA")} {tooltipUnit}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total — only in expenses mode with multiple series */}
                {mode === "expenses" && activeSeries.length > 1 && (
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
                      {activeSeries
                        .reduce((sum, s) => sum + (s.values[hoveredIndex] ?? 0), 0)
                        .toLocaleString("uk-UA")}{" "}
                      UAH
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 4 }}>
        {activeSeries.map((s) => (
          <div
            key={s.key}
            className="text-zinc-500"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}
          >
            <span
              style={{
                width: 14,
                height: 2,
                background: s.color,
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
};
