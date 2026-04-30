import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { ACCENT, BORDER, DESTRUCTIVE, MUTED_FG, SUBTLE, TINT_BG } from "@/lib/constants/ui-tokens";

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

const BillsFooter = ({
  total,
  page,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: TProps) => {
  const pageRange = getPageRange(page, totalPages);

  const pageButtonStyle = (isActive: boolean, isDisabled: boolean): React.CSSProperties => ({
    minWidth: 30,
    height: 30,
    borderRadius: 5,
    fontSize: 13,
    fontFamily: "inherit",
    border: isActive ? `1px solid ${ACCENT}` : "1px solid transparent",
    background: isActive ? TINT_BG : "transparent",
    color: isDisabled ? BORDER : isActive ? ACCENT : "#09090b",
    fontWeight: isActive ? 600 : 400,
    cursor: isDisabled ? "default" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderTop: `1px solid ${BORDER}`,
        background: SUBTLE,
      }}
    >
      {/* Total */}
      <span style={{ fontSize: 13.5, color: MUTED_FG }}>
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
            style={{
              appearance: "none",
              height: 30,
              paddingLeft: 10,
              paddingRight: 26,
              fontSize: 12.5,
              borderRadius: 6,
              minWidth: 100,
              border: `1px solid ${BORDER}`,
              background: "#fff",
              color: "#09090b",
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
            style={{ position: "absolute", right: 7, pointerEvents: "none", color: MUTED_FG }}
          />
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            style={pageButtonStyle(false, page <= 1)}
          >
            <ChevronLeft size={14} />
          </button>

          {pageRange.map((p, i) =>
            p === "…" ? (
              <span
                key={`ellipsis-${i}`}
                style={{ fontSize: 13, color: MUTED_FG, padding: "0 4px" }}
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                style={pageButtonStyle(p === page, false)}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            style={pageButtonStyle(false, page >= totalPages)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export { BillsFooter };
