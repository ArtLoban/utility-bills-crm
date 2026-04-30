import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { ACCENT, DESTRUCTIVE, TINT_BG } from "@/lib/constants/ui-tokens";

type TProps = {
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};

const getPageRange = (page: number, totalPages: number): (number | "…")[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (page > 3) pages.push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push("…");
  pages.push(totalPages);
  return pages;
};

const pageButtonStyle = (isActive: boolean, isDisabled: boolean): React.CSSProperties => ({
  minWidth: 30,
  height: 30,
  borderRadius: 5,
  fontSize: 13,
  fontFamily: "inherit",
  border: isActive ? `1px solid ${ACCENT}` : "1px solid transparent",
  background: isActive ? TINT_BG : "transparent",
  ...(isActive ? { color: ACCENT, fontWeight: 600 } : { fontWeight: 400 }),
  cursor: isDisabled ? "default" : "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 4px",
});

const pageButtonClass = (isActive: boolean, isDisabled: boolean): string => {
  if (isActive) return "";
  if (isDisabled) return "text-zinc-200 dark:text-zinc-700";
  return "text-zinc-950 dark:text-zinc-50";
};

const BillsFooter = ({
  total,
  page,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: TProps) => {
  const pageRange = getPageRange(page, totalPages);

  return (
    <div
      className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
      style={{ padding: "14px 16px" }}
    >
      {/* Total */}
      <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
        Total (filtered):{" "}
        <span
          style={{
            color: DESTRUCTIVE,
            fontWeight: 700,
            fontSize: 14,
            fontFeatureSettings: '"tnum" 1',
          }}
        >
          {`−${total.toLocaleString("en-US")} UAH`}
        </span>
      </span>

      {/* Right: per-page + pagination */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Per-page select */}
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{
              appearance: "none",
              height: 30,
              paddingLeft: 10,
              paddingRight: 26,
              fontSize: 12.5,
              borderRadius: 6,
              minWidth: 100,
              cursor: "pointer",
              fontFamily: "inherit",
              outline: "none",
            }}
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <ChevronDown
            size={12}
            strokeWidth={2}
            className="text-zinc-500 dark:text-zinc-400"
            style={{ position: "absolute", right: 7, pointerEvents: "none" }}
          />
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            style={pageButtonStyle(false, page <= 1)}
            className={pageButtonClass(false, page <= 1)}
          >
            <ChevronLeft size={14} />
          </button>

          {pageRange.map((p, i) =>
            p === "…" ? (
              <span
                key={`ellipsis-${i}`}
                className="text-zinc-500 dark:text-zinc-400"
                style={{ fontSize: 13, padding: "0 4px" }}
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                style={pageButtonStyle(p === page, false)}
                className={pageButtonClass(p === page, false)}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            style={pageButtonStyle(false, page >= totalPages)}
            className={pageButtonClass(false, page >= totalPages)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export { BillsFooter };
