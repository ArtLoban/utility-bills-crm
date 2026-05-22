"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";
import { TPayment } from "@/app/(app)/payments/_data/mock";
import { formatUAH } from "@/lib/format/currency";

type TProps = {
  payment: TPayment;
};

export const PaymentCard = ({ payment }: TProps) => {
  const router = useRouter();
  const t = useTranslations("dataTable.rowActions");
  const color = SERVICE_COLORS[payment.service.id];
  const Icon = SERVICE_ICONS[payment.service.id];
  const shortDate = payment.paidAt.split(" ").slice(0, 2).join(" ");

  return (
    <div
      className="border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
      style={{
        borderRadius: 8,
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
      }}
      onClick={() => router.push(`/payments/${payment.id}/edit`)}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `color-mix(in srgb, ${color} 10%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} style={{ color }} strokeWidth={1.75} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
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
            {shortDate} · {payment.service.name}
          </span>
          <span
            className="text-green-600 dark:text-green-500"
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFeatureSettings: '"tnum" 1',
              flexShrink: 0,
            }}
          >
            {formatUAH(payment.amount)}
          </span>
        </div>

        <span
          className="text-muted-foreground"
          style={{
            fontSize: 12,
            display: "block",
            marginTop: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {payment.property.name}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center data-[state=open]:border-zinc-200 data-[state=open]:bg-zinc-100 dark:data-[state=open]:border-zinc-700 dark:data-[state=open]:bg-zinc-800"
          style={{
            width: 28,
            height: 28,
            borderRadius: 5,
            border: "1px solid transparent",
            background: "transparent",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal
            size={15}
            strokeWidth={1.75}
            className="text-zinc-950 dark:text-zinc-50"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => router.push(`/payments/${payment.id}/edit`)}>
            <Pencil size={14} />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 size={14} />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
