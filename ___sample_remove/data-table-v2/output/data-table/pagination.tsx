"use client";

import { useTranslations } from "next-intl";

import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

import { ELLIPSIS } from "./constants";
import { getPaginationRange } from "./get-pagination-range";

type TProps = {
  page: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  page,
  pageCount,
  canPreviousPage,
  canNextPage,
  onPageChange,
}: TProps) => {
  const t = useTranslations("dataTable.pagination");
  const range = getPaginationRange(page, pageCount);

  if (pageCount <= 1) return null;

  return (
    <ShadPagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-label={t("previous")}
            aria-disabled={!canPreviousPage}
            onClick={(e) => {
              e.preventDefault();
              if (canPreviousPage) onPageChange(page - 1);
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
            aria-label={t("next")}
            aria-disabled={!canNextPage}
            onClick={(e) => {
              e.preventDefault();
              if (canNextPage) onPageChange(page + 1);
            }}
            className={cn(!canNextPage && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
};
