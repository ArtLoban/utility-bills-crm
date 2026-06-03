import { ChevronLeft, ChevronRight } from "lucide-react";

type TProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export const MobilePager = ({ page, totalPages, onPrev, onNext }: TProps) => {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const btnClass =
    "border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 inline-flex items-center justify-center rounded-lg";
  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: 36,
    height: 36,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <div className="flex items-center justify-between px-1 py-3.5">
      <button
        onClick={onPrev}
        disabled={prevDisabled}
        className={btnClass}
        style={btnStyle(prevDisabled)}
      >
        <ChevronLeft size={14} className="text-zinc-950 dark:text-zinc-50" />
      </button>

      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        Page <strong className="text-zinc-950 dark:text-zinc-50">{page}</strong> of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={btnClass}
        style={btnStyle(nextDisabled)}
      >
        <ChevronRight size={14} className="text-zinc-950 dark:text-zinc-50" />
      </button>
    </div>
  );
};
