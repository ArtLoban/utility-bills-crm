"use client";

import type { TServiceMonthlyExpense } from "../../_data/mock";
import { SERVICE_COLORS } from "../../_data/mock";
import { DataCard } from "@/components/data-card";

type TProps = {
  services: TServiceMonthlyExpense[];
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
    <DataCard className="p-6">
      <h3 className="m-0 text-[14px] font-semibold tracking-[-0.1px] text-zinc-950 dark:text-zinc-50">
        Expenses by service
      </h3>
      <p className="mt-[2px] mb-0 text-[12px] text-zinc-500">Last 12 months</p>

      {/* Donut + legend — flex row, responsive container sizes the donut via CSS */}
      <div className="mt-4 flex items-center gap-3 px-1 md:mt-5 md:gap-6">
        {/* SVG container: 170px mobile, 220px desktop */}
        <div className="relative h-[170px] w-[170px] shrink-0 md:h-[220px] md:w-[220px]">
          <svg width="100%" height="100%" viewBox="0 0 220 220">
            {arcs.map((a) => (
              <path key={a.serviceKey} d={a.path} fill={a.color} stroke="#fff" strokeWidth="1.5" />
            ))}
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[10.5px] font-medium tracking-[0.4px] text-zinc-500 uppercase">
              Total
            </div>
            <div
              className="mt-[2px] text-2xl font-semibold tracking-[-0.5px] text-zinc-950 dark:text-zinc-50"
              style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum" 1' }}
            >
              {total.toLocaleString("uk-UA")}
            </div>
            <div className="mt-[1px] text-[11px] text-zinc-500">UAH</div>
          </div>
        </div>

        {/* Legend */}
        <ul className="m-0 flex max-w-[220px] flex-col gap-2.5 p-0 [list-style:none]">
          {arcs.map((a) => (
            <li key={a.serviceKey} className="flex items-center gap-2.5 text-[13px]">
              <span
                className="h-[9px] w-[9px] shrink-0 rounded-[2px]"
                style={{ background: a.color }}
              />
              <span className="flex-1 text-zinc-950 dark:text-zinc-50">{a.label}</span>
              <span
                className="ml-auto font-medium text-zinc-500"
                style={{
                  fontSize: 12.5,
                  fontVariantNumeric: "tabular-nums",
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                {a.pct}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DataCard>
  );
};
