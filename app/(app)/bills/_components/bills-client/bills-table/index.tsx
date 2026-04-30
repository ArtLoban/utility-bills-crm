import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { TBill, TSortColumn, TSortDir } from "@/app/(app)/bills/_data/mock";
import { BORDER, MUTED_FG, SUBTLE } from "@/lib/constants/ui-tokens";
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
  if (sortCol !== col) return <ArrowUpDown size={12} style={{ color: BORDER }} />;
  return sortDir === "asc" ? (
    <ArrowUp size={12} className="text-violet-600" />
  ) : (
    <ArrowDown size={12} className="text-violet-600" />
  );
};

const BillsTable = ({ rows, sortCol, sortDir, onSort }: TProps) => {
  return (
    <div style={{ background: "#fff" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: SUBTLE }}>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => onSort(col.key)}
                style={{
                  padding: "10px 16px",
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: MUTED_FG,
                  textAlign: col.align ?? "left",
                  cursor: "pointer",
                  userSelect: "none",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {col.label}
                  <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                </span>
              </th>
            ))}
            <th
              style={{
                width: 48,
                padding: "10px 16px",
                borderBottom: `1px solid ${BORDER}`,
                cursor: "default",
              }}
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
