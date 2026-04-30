import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { TBill, TSortColumn, TSortDir } from "@/app/(app)/bills/_data/mock";
import { BillRow } from "./bill-row";

type TProps = {
  rows: TBill[];
  sortCol: TSortColumn;
  sortDir: TSortDir;
  onSort: (col: TSortColumn) => void;
};

const COLUMNS: { key: TSortColumn; label: string; align?: "right" }[] = [
  { key: "date", label: "Date" },
  { key: "property", label: "Property" },
  { key: "service", label: "Service" },
  { key: "period", label: "Period" },
  { key: "amount", label: "Amount", align: "right" },
];

type TSortIconProps = { col: TSortColumn; sortCol: TSortColumn; sortDir: TSortDir };

const SortIcon = ({ col, sortCol, sortDir }: TSortIconProps) => {
  if (sortCol !== col)
    return <ArrowUpDown size={12} className="text-zinc-300 dark:text-zinc-700" />;
  return sortDir === "asc" ? (
    <ArrowUp size={12} className="text-violet-600" />
  ) : (
    <ArrowDown size={12} className="text-violet-600" />
  );
};

const BillsTable = ({ rows, sortCol, sortDir, onSort }: TProps) => {
  return (
    <div className="bg-white dark:bg-zinc-900">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-900">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => onSort(col.key)}
                className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                style={{
                  padding: "10px 16px",
                  fontSize: 12.5,
                  fontWeight: 500,
                  textAlign: col.align ?? "left",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {col.label}
                  <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                </span>
              </th>
            ))}
            <th
              className="border-b border-zinc-200 dark:border-zinc-800"
              style={{ width: 48, padding: "10px 16px", cursor: "default" }}
            />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <BillRow key={row.id} row={row} isLast={i === rows.length - 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { BillsTable };
