import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceBadge } from "@/app/(app)/bills/_components/bills-client/service-badge";
import { TBill } from "@/app/(app)/bills/_data/mock";
import { BORDER, DESTRUCTIVE, MUTED_FG, SUBTLE } from "@/lib/constants/ui-tokens";

type TProps = {
  row: TBill;
  isLast: boolean;
};

const formatAmount = (amount: number): string => `−${amount.toLocaleString("en-US")} UAH`;

const BillRow = ({ row, isLast }: TProps) => {
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
        style={{ ...tdStyle, width: 48, textAlign: "right" }}
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              border: "1px solid transparent",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="data-popup-open:border-zinc-200 data-popup-open:bg-zinc-100"
          >
            <MoreHorizontal size={15} strokeWidth={1.75} color="#09090b" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {/* devnote: wire Edit action when API routes exist */}
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* devnote: wire Delete action when API routes exist */}
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export { BillRow };
