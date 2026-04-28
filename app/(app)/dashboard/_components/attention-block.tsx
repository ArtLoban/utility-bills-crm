import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import type { TDashboardData } from "../_data/mock";

type TProps = {
  data: NonNullable<TDashboardData["attention"]>;
};

export const AttentionBlock = ({ data }: TProps) => {
  const { totalDebt, debtServicesCount, readingsDueCount, readingsDueDate } = data;

  return (
    <div
      className="rounded-lg border bg-white shadow transition-shadow duration-150 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none"
      style={{
        borderLeft: "4px solid #f59e0b",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AlertTriangle size={18} color="#f59e0b" />
        <h3
          className="text-zinc-950 dark:text-zinc-50"
          style={{ margin: 0, fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1 }}
        >
          Attention required
        </h3>
      </div>

      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {debtServicesCount > 0 && (
          <li
            className="text-zinc-950 dark:text-zinc-50"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              fontSize: 13.5,
            }}
          >
            <span className="text-zinc-500" style={{ width: 8 }}>
              •
            </span>
            <span style={{ flex: 1 }}>
              {"Debt: "}
              <strong style={{ color: "#dc2626", fontWeight: 600 }}>
                {Math.abs(totalDebt).toLocaleString("uk-UA")} UAH
              </strong>
              <span className="text-zinc-500"> total ({debtServicesCount} services)</span>
            </span>
            <Link
              href="/bills"
              style={{
                color: "#7c3aed",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                flexShrink: 0,
              }}
            >
              View details
              <ChevronRight size={14} color="#7c3aed" />
            </Link>
          </li>
        )}

        {readingsDueCount > 0 && (
          <li
            className="text-zinc-950 dark:text-zinc-50"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              fontSize: 13.5,
            }}
          >
            <span className="text-zinc-500" style={{ width: 8 }}>
              •
            </span>
            <span style={{ flex: 1 }}>
              {"Submit readings by "}
              <strong style={{ fontWeight: 600 }}>{readingsDueDate}</strong>
              <span className="text-zinc-500"> ({readingsDueCount} meters)</span>
            </span>
            <Link
              href="/properties"
              style={{
                color: "#7c3aed",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                flexShrink: 0,
              }}
            >
              Go to meters
              <ChevronRight size={14} color="#7c3aed" />
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};
