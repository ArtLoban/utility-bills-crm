import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceBadge } from "@/app/(app)/payments/_components/payments-client/service-badge";
import { TPayment } from "@/app/(app)/payments/_data/mock";

const SUCCESS_COLOR = "#16a34a";

type TProps = {
  row: TPayment;
  isLast: boolean;
  onEdit: (payment: TPayment) => void;
};

const formatAmount = (amount: number): string => amount.toLocaleString("en-US") + " UAH";

const PaymentRow = ({ row, isLast, onEdit }: TProps) => {
  const t = useTranslations("payments.list");
  const tdBorderClass = isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800";
  const tdBaseClass = `${tdBorderClass} text-zinc-950 dark:text-zinc-50`;
  const tdStyle: React.CSSProperties = { padding: "13px 16px", fontSize: 13.5 };

  return (
    <tr
      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      style={{ cursor: "pointer" }}
      onClick={() => onEdit(row)}
    >
      <td className={tdBaseClass} style={tdStyle}>
        {row.paidAt}
      </td>
      <td className={tdBaseClass} style={tdStyle}>
        {row.property.name}
      </td>
      <td className={tdBaseClass} style={tdStyle}>
        <ServiceBadge service={row.service} />
      </td>
      <td
        className={tdBorderClass}
        style={{
          ...tdStyle,
          textAlign: "right",
          fontFeatureSettings: '"tnum" 1',
          color: SUCCESS_COLOR,
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
            <DropdownMenuItem onClick={() => onEdit(row)}>{t("actions.edit")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* devnote: wire Delete when deletePayment server action is implemented */}
            <DropdownMenuItem variant="destructive">{t("actions.delete")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export { PaymentRow };
