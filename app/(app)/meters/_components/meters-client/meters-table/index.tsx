import { useTranslations } from "next-intl";

import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import { MeterRow } from "./meter-row";

type TProps = {
  rows: TMeterGlobalRow[];
  showHistoricalBadge: boolean;
};

const MetersTable = ({ rows, showHistoricalBadge }: TProps) => {
  const t = useTranslations("meters.list.columns");

  const COLUMNS = [
    t("property"),
    t("service"),
    t("serial"),
    t("zones"),
    t("installed"),
    t("lastReading"),
  ];

  return (
    <div className="bg-white dark:bg-zinc-900">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-900">
            {COLUMNS.map((label) => (
              <th
                key={label}
                className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                style={{
                  padding: "10px 16px",
                  fontSize: 12.5,
                  fontWeight: 500,
                  textAlign: "left",
                  userSelect: "none",
                }}
              >
                {label}
              </th>
            ))}
            <th
              className="border-b border-zinc-200 dark:border-zinc-800"
              style={{ width: 48, padding: "10px 16px" }}
            />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <MeterRow
              key={row.meter.id}
              row={row}
              showHistoricalBadge={showHistoricalBadge}
              isLast={i === rows.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { MetersTable };
