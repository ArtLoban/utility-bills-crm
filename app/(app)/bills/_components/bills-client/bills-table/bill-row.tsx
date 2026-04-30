import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { ServiceBadge } from "@/app/(app)/bills/_components/bills-client/service-badge";
import { TBill } from "@/app/(app)/bills/_data/mock";

type TProps = {
  row: TBill;
  isLast: boolean;
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
};

const BORDER = "#e4e4e7";
const SUBTLE = "#fafafa";
const MUTED = "#f4f4f5";
const DESTRUCTIVE = "#dc2626";
const MUTED_FG = "#71717a";

const formatAmount = (amount: number): string => `−${amount.toLocaleString("en-US")} UAH`;

const BillRow = ({ row, isLast, menuOpen, onMenuOpen, onMenuClose }: TProps) => {
  const [hover, setHover] = useState(false);

  const tdBorder = isLast ? "none" : `1px solid ${BORDER}`;

  const tdStyle: React.CSSProperties = {
    padding: "13px 16px",
    fontSize: 13.5,
    color: "#09090b",
    borderBottom: tdBorder,
    background: hover ? SUBTLE : undefined,
  };

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
      // devnote: clicking the row should navigate to a bill detail page — not yet implemented
    >
      <td style={tdStyle}>{row.date}</td>
      <td style={tdStyle}>{row.property.name}</td>
      <td style={tdStyle}>
        <ServiceBadge service={row.service} />
      </td>
      <td style={{ ...tdStyle, fontSize: 13, color: MUTED_FG }}>{row.period}</td>
      <td
        style={{
          ...tdStyle,
          textAlign: "right",
          fontFeatureSettings: '"tnum" 1',
          color: DESTRUCTIVE,
          fontWeight: 500,
        }}
      >
        {formatAmount(row.amount)}
      </td>
      <td
        style={{
          ...tdStyle,
          width: 48,
          textAlign: "right",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (menuOpen) {
              onMenuClose();
            } else {
              onMenuOpen();
            }
          }}
          style={{
            width: 28,
            height: 28,
            borderRadius: 5,
            border: menuOpen ? `1px solid ${BORDER}` : "1px solid transparent",
            background: menuOpen ? MUTED : "transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MoreHorizontal size={15} strokeWidth={1.75} color="#09090b" />
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 34,
              width: 130,
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              boxShadow: "0 4px 16px rgba(9,9,11,0.10)",
              zIndex: 20,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => onMenuClose()}
              style={{
                display: "block",
                width: "100%",
                padding: "9px 14px",
                fontSize: 13,
                fontFamily: "inherit",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                color: "#09090b",
              }}
              // devnote: wire Edit action when API routes exist
            >
              Edit
            </button>
            <button
              onClick={() => onMenuClose()}
              style={{
                display: "block",
                width: "100%",
                padding: "9px 14px",
                fontSize: 13,
                fontFamily: "inherit",
                background: "none",
                borderTop: `1px solid ${BORDER}`,
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "none",
                textAlign: "left",
                cursor: "pointer",
                color: DESTRUCTIVE,
              }}
              // devnote: wire Delete action when API routes exist
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export { BillRow };
