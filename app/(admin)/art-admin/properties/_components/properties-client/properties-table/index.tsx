import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { TProperty, TSortColumn, TSortDir } from "@/app/(admin)/art-admin/properties/_data/mock";
import { PropertyRow } from "./property-row";

type TProps = {
  rows: TProperty[];
  sortCol: TSortColumn;
  sortDir: TSortDir;
  onSort: (col: TSortColumn) => void;
};

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

const thStyle: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: 12.5,
  fontWeight: 500,
  textAlign: "left",
  cursor: "pointer",
  userSelect: "none",
};

const thClass = "border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400";

const PropertiesTable = ({ rows, sortCol, sortDir, onSort }: TProps) => (
  <div className="bg-white dark:bg-zinc-900">
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr className="bg-zinc-50 dark:bg-zinc-900">
          <th className={thClass} style={thStyle} onClick={() => onSort("name")}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              Name
              <SortIcon col="name" sortCol={sortCol} sortDir={sortDir} />
            </span>
          </th>
          <th className={thClass} style={{ ...thStyle, cursor: "default" }}>
            Owner(s)
          </th>
          <th className={thClass} style={{ ...thStyle, cursor: "default" }}>
            Type
          </th>
          <th className={thClass} style={{ ...thStyle, cursor: "default" }}>
            Status
          </th>
          <th className={thClass} style={{ ...thStyle, textAlign: "right", cursor: "default" }}>
            Services
          </th>
          <th className={thClass} style={thStyle} onClick={() => onSort("created")}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              Created
              <SortIcon col="created" sortCol={sortCol} sortDir={sortDir} />
            </span>
          </th>
          <th
            className="border-b border-zinc-200 dark:border-zinc-800"
            style={{ width: 48, padding: "10px 16px", cursor: "default" }}
          />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <PropertyRow key={row.id} row={row} isLast={i === rows.length - 1} />
        ))}
      </tbody>
    </table>
  </div>
);

export { PropertiesTable };
