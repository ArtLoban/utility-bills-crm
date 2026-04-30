import { ChevronLeft, ChevronRight } from "lucide-react";

type TProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const MobilePager = ({ page, totalPages, onPrev, onNext }: TProps) => {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0 4px",
      }}
    >
      <button
        onClick={onPrev}
        disabled={prevDisabled}
        style={navBtnStyle(prevDisabled)}
        className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <ChevronLeft size={14} className="text-zinc-950 dark:text-zinc-50" />
      </button>

      <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13 }}>
        Page <strong className="text-zinc-950 dark:text-zinc-50">{page}</strong> of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={nextDisabled}
        style={navBtnStyle(nextDisabled)}
        className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <ChevronRight size={14} className="text-zinc-950 dark:text-zinc-50" />
      </button>
    </div>
  );
};

export { MobilePager };
