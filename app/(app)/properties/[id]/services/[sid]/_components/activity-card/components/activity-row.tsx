"use client";

import { useState } from "react";
import { ChevronRight, Receipt, Wallet } from "lucide-react";

import { DESTRUCTIVE, SUCCESS } from "@/lib/constants/ui-tokens";
import type { TActivityItem } from "../../../_data/mock";

type TProps = { item: TActivityItem; isLast: boolean };

const BILL_COLOR = "#ef4444";
const PAYMENT_COLOR = "#16a34a";

const ActivityRow = ({ item, isLast }: TProps) => {
  const [hovered, setHovered] = useState(false);

  const isBill = item.type === "bill";
  const iconColor = isBill ? BILL_COLOR : PAYMENT_COLOR;
  const amountColor = isBill ? DESTRUCTIVE : SUCCESS;
  const amountPrefix = isBill ? "−" : "+";
  const title = isBill ? `Bill · ${item.period}` : `Payment · ${item.period}`;

  return (
    <div
      className="flex items-center gap-3.5"
      style={{
        padding: "13px 20px",
        cursor: "pointer",
        background: hovered ? "#fafafa" : "transparent",
        borderBottom: isLast ? "none" : "1px solid #e4e4e7",
        transition: "background 120ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon block */}
      <div
        className="flex shrink-0 items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: iconColor + "15",
        }}
      >
        {isBill ? (
          <Receipt size={14} style={{ color: iconColor }} />
        ) : (
          <Wallet size={14} style={{ color: iconColor }} />
        )}
      </div>

      {/* Middle */}
      <div className="min-w-0 flex-1">
        <div
          className="text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, fontWeight: 500 }}
        >
          {title}
        </div>
        {item.note && (
          <div className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
            {item.note}
          </div>
        )}
        <div className="text-zinc-400 dark:text-zinc-500" style={{ fontSize: 12 }}>
          {item.date}
        </div>
      </div>

      {/* Amount */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          fontFeatureSettings: '"tnum" 1',
          color: amountColor,
          flexShrink: 0,
        }}
      >
        {amountPrefix}
        {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ₴
      </div>

      {/* Chevron */}
      <ChevronRight
        size={14}
        style={{
          flexShrink: 0,
          color: hovered ? "#7c3aed" : "#d4d4d8",
          transition: "color 120ms",
        }}
      />
    </div>
  );
};

export { ActivityRow };
