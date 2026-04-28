"use client";

import type { TDashboardData } from "../../_data/mock";
import { SERVICE_COLORS } from "../../_data/mock";

type TProps = {
  services: TDashboardData["charts"]["services"];
};

type TPieSlice = {
  serviceKey: string;
  label: string;
  value: number;
  color: string;
  pct: number;
  path: string;
};

const buildArcs = (services: TProps["services"]): TPieSlice[] => {
  const totals = services.map((s) => ({
    serviceKey: s.serviceKey,
    label: s.label,
    value: s.monthlyAmounts.reduce((sum, v) => sum + v, 0),
    color: SERVICE_COLORS[s.serviceKey],
  }));

  const total = totals.reduce((sum, d) => sum + d.value, 0);
  const sorted = [...totals].sort((a, b) => b.value - a.value);

  const cx = 110,
    cy = 110,
    r = 100,
    rInner = 62;
  const f = (n: number) => n.toFixed(4);
  let start = -Math.PI / 2;

  return sorted.map((d) => {
    const frac = d.value / total;
    const end = start + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(start),
      y0 = cy + r * Math.sin(start);
    const x1 = cx + r * Math.cos(end),
      y1 = cy + r * Math.sin(end);
    const xi1 = cx + rInner * Math.cos(end),
      yi1 = cy + rInner * Math.sin(end);
    const xi0 = cx + rInner * Math.cos(start),
      yi0 = cy + rInner * Math.sin(start);
    const path = `M ${f(x0)} ${f(y0)} A ${r} ${r} 0 ${large} 1 ${f(x1)} ${f(y1)} L ${f(xi1)} ${f(yi1)} A ${rInner} ${rInner} 0 ${large} 0 ${f(xi0)} ${f(yi0)} Z`;
    start = end;
    return { ...d, pct: Math.round(frac * 100), path };
  });
};

export const ExpensePieChart = ({ services }: TProps) => {
  const arcs = buildArcs(services);
  const total = arcs.reduce((sum, a) => sum + a.value, 0);

  return (
    <div
      className="rounded-lg border bg-white shadow transition-shadow duration-150 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none"
      style={{
        padding: 24,
      }}
    >
      <h3
        className="text-zinc-950 dark:text-zinc-50"
        style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}
      >
        Expenses by service
      </h3>
      <p className="text-zinc-500" style={{ margin: "2px 0 0", fontSize: 12 }}>
        Last 12 months
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 24,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        {/* Donut SVG */}
        <div style={{ position: "relative", width: 220, height: 220 }}>
          <svg width="220" height="220" viewBox="0 0 220 220">
            {arcs.map((a) => (
              <path key={a.serviceKey} d={a.path} fill={a.color} stroke="#fff" strokeWidth="1.5" />
            ))}
          </svg>

          {/* Center label */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="text-zinc-500"
              style={{
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                fontWeight: 500,
              }}
            >
              Total
            </div>
            <div
              className="text-zinc-950 dark:text-zinc-50"
              style={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: -0.5,
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum" 1',
                marginTop: 2,
              }}
            >
              {total.toLocaleString("uk-UA")}
            </div>
            <div className="text-zinc-500" style={{ fontSize: 11, marginTop: 1 }}>
              UAH
            </div>
          </div>
        </div>

        {/* Legend */}
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            maxWidth: 220,
          }}
        >
          {arcs.map((a) => (
            <li
              key={a.serviceKey}
              style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: a.color,
                  flexShrink: 0,
                }}
              />
              <span className="text-zinc-950 dark:text-zinc-50" style={{ flex: 1 }}>
                {a.label}
              </span>
              <span
                className="text-zinc-500"
                style={{
                  fontSize: 12.5,
                  fontVariantNumeric: "tabular-nums",
                  fontFeatureSettings: '"tnum" 1',
                  fontWeight: 500,
                }}
              >
                {a.pct}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
