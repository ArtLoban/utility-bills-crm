import { Droplets, Flame, MoreHorizontal, Thermometer, Wifi, Zap } from "lucide-react";
import { useState } from "react";

import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { TBill } from "@/app/(app)/bills/_data/mock";

type TProps = { row: TBill };

const ICON_MAP: Record<string, React.ElementType> = {
  electricity: Zap,
  gas: Flame,
  coldWater: Droplets,
  hotWater: Droplets,
  heating: Thermometer,
  internet: Wifi,
};

const BORDER = "#e4e4e7";
const MUTED = "#f4f4f5";
const MUTED_FG = "#71717a";
const DESTRUCTIVE = "#dc2626";

const BillCard = ({ row }: TProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const color = SERVICE_COLORS[row.service.id];
  const Icon = ICON_MAP[row.service.id] ?? Zap;
  const shortDate = row.date.split(" ").slice(0, 2).join(" ");
  const amountStr = `−${row.amount.toLocaleString()}`;

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        boxShadow: "0 1px 2px rgba(24,24,27,0.04)",
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Service icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} style={{ color }} strokeWidth={1.75} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: -0.1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {shortDate} · {row.service.name}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: DESTRUCTIVE,
              fontFeatureSettings: '"tnum" 1',
              flexShrink: 0,
            }}
          >
            {amountStr}
          </span>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: MUTED_FG,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {row.property.name} · {row.period}
          </span>
          <span style={{ fontSize: 11.5, color: MUTED_FG, marginLeft: 4, flexShrink: 0 }}>UAH</span>
        </div>
      </div>

      {/* Kebab */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
      </div>
    </div>
  );
};

export { BillCard };
