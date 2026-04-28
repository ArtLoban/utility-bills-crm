import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { TBill, TSortColumn, TSortDir } from "@/app/(app)/bills/_data/mock";
import { BillRow } from "./bill-row";

type TProps = {
  rows: TBill[];
  sortCol: TSortColumn;
  sortDir: TSortDir;
  onSort: (col: TSortColumn) => void;
  openMenuId: number | null;
  onMenuOpenChange: (id: number | null) => void;
};

const BORDER = "#e4e4e7";
const SUBTLE = "#fafafa";
const MUTED_FG = "#71717a";

const COLUMNS: { key: TSortColumn; label: string; align?: "right" }[] = [
  { key: "date", label: "Date" },
  { key: "property", label: "Property" },
  { key: "service", label: "Service" },
  { key: "period", label: "Period" },
  { key: "amount", label: "Amount", align: "right" },
];

const BillsTable = ({ rows, sortCol, sortDir, onSort, openMenuId, onMenuOpenChange }: TProps) => {
  const SortIcon = ({ col }: { col: TSortColumn }) => {
    if (sortCol !== col) return <ArrowUpDown size={12} style={{ color: BORDER }} />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-violet-600" />
    ) : (
      <ArrowDown size={12} className="text-violet-600" />
    );
  };

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        boxShadow: "0 1px 2px 0 rgba(24,24,27,0.05)",
        overflow: "hidden",
      }}
    >
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
                  <SortIcon col={col.key} />
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
            <BillRow
              key={row.id}
              row={row}
              isLast={i === rows.length - 1}
              menuOpen={openMenuId === row.id}
              onMenuOpen={() => onMenuOpenChange(row.id)}
              onMenuClose={() => onMenuOpenChange(null)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { BillsTable };
