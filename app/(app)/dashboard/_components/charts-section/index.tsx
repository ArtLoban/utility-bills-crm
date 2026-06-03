"use client";

import { useState } from "react";
import type { TDashboardData } from "../../_data/mock";
import { ExpensePieChart } from "./expense-pie-chart";
import { MonthlyBarChart } from "./monthly-bar-chart";
import { TrendLineChart } from "./trend-line-chart";

type TProps = {
  data: TDashboardData["charts"];
};

export const ChartsSection = ({ data }: TProps) => {
  const [period, setPeriod] = useState("Last 12 months");
  const [property, setProperty] = useState("All properties");
  const [service, setService] = useState("All services");

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile analytics section header */}
      <div className="flex items-center justify-between md:hidden">
        <span className="text-muted-foreground text-[11.5px] font-semibold tracking-[0.6px] uppercase">
          Analytics
        </span>
        <span className="text-muted-foreground text-xs">{data.periodLabel}</span>
      </div>

      {/* Filter bar — desktop only */}
      <div className="hidden items-center gap-2 rounded-[8px] border bg-white px-3 py-2.5 shadow transition-shadow duration-150 hover:shadow-md md:flex dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none">
        <span className="pr-1 pl-1 text-[12.5px] text-zinc-500">Filter</span>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          style={{
            height: 32,
            padding: "0 8px",
            fontSize: 13,
            borderRadius: 6,
            fontFamily: "inherit",
            cursor: "pointer",
            minWidth: 180,
          }}
        >
          <option>Last 12 months</option>
          <option>Last 6 months</option>
          <option>This year</option>
        </select>

        <select
          value={property}
          onChange={(e) => setProperty(e.target.value)}
          className="border dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          style={{
            height: 32,
            padding: "0 8px",
            fontSize: 13,
            borderRadius: 6,
            fontFamily: "inherit",
            cursor: "pointer",
            minWidth: 160,
          }}
        >
          <option>All properties</option>
        </select>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="border dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          style={{
            height: 32,
            padding: "0 8px",
            fontSize: 13,
            borderRadius: 6,
            fontFamily: "inherit",
            cursor: "pointer",
            minWidth: 150,
          }}
        >
          <option>All services</option>
        </select>

        <div className="flex-1" />
        <span className="text-[12px] text-zinc-500">{data.periodLabel}</span>
      </div>

      {/* Top row: Pie + Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr]">
        <ExpensePieChart services={data.services} />
        <MonthlyBarChart services={data.services} months={data.months} />
      </div>

      {/* Bottom row: Line */}
      <TrendLineChart services={data.services} months={data.months} />
    </div>
  );
};
