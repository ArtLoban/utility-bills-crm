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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filter bar */}
      <div
        className="border bg-white shadow transition-shadow duration-150 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          borderRadius: 8,
        }}
      >
        <span className="text-zinc-500" style={{ fontSize: 12.5, paddingLeft: 4, marginRight: 4 }}>
          Filter
        </span>

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

        <div style={{ flex: 1 }} />
        <span className="text-zinc-500" style={{ fontSize: 12 }}>
          {data.periodLabel}
        </span>
      </div>

      {/* Top row: Pie + Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 16,
        }}
      >
        <ExpensePieChart services={data.services} />
        <MonthlyBarChart services={data.services} months={data.months} />
      </div>

      {/* Bottom row: Line */}
      <TrendLineChart services={data.services} months={data.months} />
    </div>
  );
};
