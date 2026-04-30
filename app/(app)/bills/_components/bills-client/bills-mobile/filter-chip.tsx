import { X } from "lucide-react";

type TProps = {
  label: string;
  color?: string;
  onRemove: () => void;
};

const FilterChip = ({ label, color, onRemove }: TProps) => {
  const isColored = color !== undefined;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: 24,
        padding: "0 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: isColored ? color + "18" : "#f4f4f5",
        border: `1px solid ${isColored ? color + "30" : "#e4e4e7"}`,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          width: 10,
          height: 10,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          color: "#71717a",
        }}
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </span>
  );
};

export { FilterChip };
