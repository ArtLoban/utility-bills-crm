import { useId } from "react";

import { cn } from "@/lib/utils";

type TProps = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  fullWidth?: boolean;
};

export const DateInput = ({ label, value, onChange, fullWidth = false }: TProps) => {
  const inputId = useId();
  const isActive = Boolean(value);

  return (
    <div
      className={cn(
        "border-input relative flex h-8 items-center gap-1.5 rounded-sm border bg-transparent px-2.5 text-sm transition-colors",
        fullWidth ? "w-full" : "min-w-[160px]",
        isActive && "border-[var(--field-tint-border)] bg-[var(--field-tint-bg)]",
      )}
    >
      <label
        htmlFor={inputId}
        className={cn(
          "shrink-0 text-xs font-medium",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </label>
      <input
        id={inputId}
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="min-w-0 flex-1 bg-transparent [color-scheme:light] outline-none dark:[color-scheme:dark]"
      />
    </div>
  );
};
