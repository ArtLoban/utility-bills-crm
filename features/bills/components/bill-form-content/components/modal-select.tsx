import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";

type TProps = {
  value: string;
  isFilled: boolean;
  onChange: (v: string) => void;
  children: ReactNode;
};

export const ModalSelect = ({ value, isFilled, onChange, children }: TProps) => (
  <div style={{ position: "relative" }}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        !isFilled
          ? `border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${
              value === "" ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-950 dark:text-zinc-50"
            }`
          : ""
      }
      style={{
        appearance: "none",
        width: "100%",
        height: 36,
        paddingLeft: 12,
        paddingRight: 32,
        fontSize: 14,
        borderRadius: 6,
        cursor: "pointer",
        outline: "none",
        fontFamily: "inherit",
        ...(isFilled
          ? {
              border: `1px solid ${TINT_BORDER}`,
              background: TINT_BG,
              color: "#09090b",
              fontWeight: 500,
            }
          : { fontWeight: 400 }),
      }}
    >
      {children}
    </select>
    <ChevronDown
      size={14}
      strokeWidth={2}
      className={!isFilled ? "text-zinc-500 dark:text-zinc-400" : ""}
      style={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        ...(isFilled ? { color: ACCENT } : {}),
      }}
    />
  </div>
);
