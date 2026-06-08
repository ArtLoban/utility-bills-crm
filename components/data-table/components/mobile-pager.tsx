import { ChevronLeft, ChevronRight } from "lucide-react";

import { PAGE_SIZE_OPTIONS } from "@/components/data-table/constants";
import { Button } from "@/components/ui/button";
import type { TListParams } from "@/components/data-table/types";
import { TServerPagination } from "@/lib/types/data-table";

type TProps = {
  pagination: TServerPagination;
  listParams: TListParams;
};

export const MobilePager = ({ pagination, listParams }: TProps) => {
  const { page, totalPages, pageSize } = pagination;
  const { setPage, setPageSize } = listParams;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-4">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-muted-foreground shrink-0 text-sm">Show:</span>
        <div className="flex gap-2">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <Button
              variant={size === pageSize ? "default" : "outline"}
              key={size}
              onClick={() => setPageSize(size)}
              className="rounded-sm"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Button variant="default" onClick={() => setPage(page - 1)} disabled={prevDisabled}>
          <ChevronLeft size={14} />
        </Button>
        <span className="text-muted-foreground text-sm">
          Page <strong className="text-foreground">{page}</strong> of {totalPages}
        </span>
        <Button variant="default" onClick={() => setPage(page + 1)} disabled={nextDisabled}>
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
};
