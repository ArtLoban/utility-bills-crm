"use client";

import { cn } from "@/lib/utils";

type TProps = {
  value: string;
  selected: string;
  onSelect: (value: string) => void;
  label: string;
  helper: string;
  children?: React.ReactNode;
};

const RadioOption = ({ value, selected, onSelect, label, helper, children }: TProps) => {
  const isActive = value === selected;

  return (
    <div
      onClick={() => onSelect(value)}
      style={{
        padding: "14px 16px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "border-color 120ms, background 120ms",
      }}
      className={cn(
        isActive
          ? "border-[1.5px] border-[#7c3aed] bg-[#f5f3ff] dark:bg-zinc-900"
          : "border-[1.5px] border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Custom radio dot */}
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: isActive ? "2px solid #7c3aed" : "2px solid #d4d4d8",
            background: isActive ? "#7c3aed" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color 120ms, background 120ms",
          }}
        >
          {isActive && (
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#ffffff",
              }}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 13.5, fontWeight: 600 }}
          >
            {label}
          </div>
          <div className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12.5 }}>
            {helper}
          </div>
        </div>
      </div>

      {isActive && children && (
        <div
          className="border-t border-[#ede9fe] dark:border-zinc-700"
          style={{ paddingTop: 16, marginTop: 14 }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export { RadioOption };
