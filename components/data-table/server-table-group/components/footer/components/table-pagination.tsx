"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getPaginationRange } from "./utils/get-pagination-range";
import { ELLIPSIS } from "@/components/data-table/constants";

type TProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export const TablePagination = ({ page, totalPages, onChange }: TProps) => {
  const range = getPaginationRange(page, totalPages);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onChange(page - 1);
            }}
            className={cn(!canPrev && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        {range.map((item, i) =>
          item === ELLIPSIS ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onChange(page + 1);
            }}
            className={cn(!canNext && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
