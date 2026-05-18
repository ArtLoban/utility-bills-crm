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
import { ELLIPSIS } from "./constants";

type TProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
};

export const TablePagination = ({
  page,
  pageCount,
  onPageChange,
  canPreviousPage,
  canNextPage,
}: TProps) => {
  const range = getPaginationRange(page, pageCount);

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(page - 1);
            }}
            className={cn(!canPreviousPage && "pointer-events-none opacity-50")}
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
                  onPageChange(item);
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
              onPageChange(page + 1);
            }}
            className={cn(!canNextPage && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
