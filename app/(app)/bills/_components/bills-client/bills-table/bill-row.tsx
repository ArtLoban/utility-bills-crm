import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceBadge } from "@/app/(app)/bills/_components/bills-client/service-badge";
import { TBill } from "@/app/(app)/bills/_data/mock";
import { DESTRUCTIVE } from "@/lib/constants/ui-tokens";

type TProps = {
  row: TBill;
  isLast: boolean;
};

const formatAmount = (amount: number): string => `−${amount.toLocaleString("en-US")} UAH`;

const BillRow = ({ row, isLast }: TProps) => {
  const tdBorderClass = isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800";
  const tdBaseClass = `${tdBorderClass} text-zinc-950 dark:text-zinc-50`;

  const tdStyle: React.CSSProperties = {
    padding: "13px 16px",
    fontSize: 13.5,
  };

  return (
    <tr
      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      style={{ cursor: "pointer" }}
      // devnote: clicking the row should navigate to a bill detail page — not yet implemented
    >
      <td className={tdBaseClass} style={tdStyle}>
        {row.date}
      </td>
      <td className={tdBaseClass} style={tdStyle}>
        {row.property.name}
      </td>
      <td className={tdBaseClass} style={tdStyle}>
        <ServiceBadge service={row.service} />
      </td>
      <td
        className={`${tdBorderClass} text-zinc-500 dark:text-zinc-400`}
        style={{ ...tdStyle, fontSize: 13 }}
      >
        {row.period}
      </td>
      <td
        className={tdBorderClass}
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
        className={tdBorderClass}
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
            className="data-popup-open:border-zinc-200 data-popup-open:bg-zinc-100 dark:data-popup-open:border-zinc-700 dark:data-popup-open:bg-zinc-800"
          >
            <MoreHorizontal
              size={15}
              strokeWidth={1.75}
              className="text-zinc-950 dark:text-zinc-50"
            />
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
