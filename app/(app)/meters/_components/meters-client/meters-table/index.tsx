import { useTranslations } from "next-intl";

import type { TGlobalMeter } from "../../../_data/mock";
import { MeterRow } from "./meter-row";

type TProps = {
  rows: TGlobalMeter[];
  showHistoricalBadge: boolean;
  onSubmitReading: (meter: TGlobalMeter) => void;
};

const MetersTable = ({ rows, showHistoricalBadge, onSubmitReading }: TProps) => {
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
          {rows.map((meter, i) => (
            <MeterRow
              key={meter.id}
              meter={meter}
              showHistoricalBadge={showHistoricalBadge}
              onSubmitReading={onSubmitReading}
              isLast={i === rows.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { MetersTable };
