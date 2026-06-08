import { ChevronLeft, ChevronRight } from "lucide-react";

import { PAGE_SIZE_OPTIONS } from "@/components/data-table/constants";

type TProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

const MobilePager = ({ page, totalPages, pageSize, setPageSize, onPrev, onNext }: TProps) => {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-4">
      {/* Page size selector */}
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-muted-foreground shrink-0 text-xs">Show:</span>
        <div className="flex gap-1">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => setPageSize(size)}
              className="h-7 min-w-[38px] cursor-pointer rounded px-2 text-xs font-medium"
              style={{
                background: size === pageSize ? "var(--primary)" : "transparent",
                color: size === pageSize ? "var(--primary-foreground)" : "var(--muted-foreground)",
                border: `1px solid ${size === pageSize ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination nav */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onPrev}
          disabled={prevDisabled}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white disabled:cursor-default disabled:opacity-35 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <ChevronLeft size={14} className="text-zinc-950 dark:text-zinc-50" />
        </button>

        <span className="text-muted-foreground text-[13px]">
          Page <strong className="text-foreground">{page}</strong> of {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white disabled:cursor-default disabled:opacity-35 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <ChevronRight size={14} className="text-zinc-950 dark:text-zinc-50" />
        </button>
      </div>
    </div>
  );
};

export { MobilePager };
