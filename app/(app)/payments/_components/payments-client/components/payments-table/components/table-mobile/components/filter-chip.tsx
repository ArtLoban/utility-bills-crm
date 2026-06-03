import { X } from "lucide-react";

type TProps = {
  label: string;
  color?: string;
  onRemove: () => void;
};

export const FilterChip = ({ label, color, onRemove }: TProps) => (
  <span
    className={
      !color
        ? "border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
        : undefined
    }
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      height: 24,
      padding: "0 8px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      ...(color
        ? {
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
          }
        : {}),
    }}
  >
    {label}
    <button
      onClick={onRemove}
      className="inline-flex items-center justify-center text-zinc-500 dark:text-zinc-400"
      style={{
        width: 10,
        height: 10,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <X size={10} strokeWidth={2.5} />
    </button>
  </span>
);
