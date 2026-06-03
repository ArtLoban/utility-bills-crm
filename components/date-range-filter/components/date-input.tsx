import { cn } from "@/lib/utils";

type TProps = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
};

export const DateInput = ({ label, value, onChange }: TProps) => {
  const isActive = Boolean(value);

  return (
    <div
      className={cn(
        "border-input relative flex h-8 min-w-[160px] items-center gap-1.5 rounded-sm border bg-transparent px-2.5 text-sm transition-colors",
        isActive && "border-[var(--field-tint-border)] bg-[var(--field-tint-bg)]",
      )}
    >
      <span
        className={cn(
          "pointer-events-none shrink-0 text-xs font-medium",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      <input
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="min-w-0 flex-1 bg-transparent [color-scheme:light] outline-none dark:[color-scheme:dark]"
      />
    </div>
  );
};
