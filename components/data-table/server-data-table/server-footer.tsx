"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ELLIPSIS, PAGE_SIZE_OPTIONS } from "@/components/data-table/constants";
import { getPaginationRange } from "@/components/data-table/client-data-table/components/footer/components/utils/get-pagination-range";

type TProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  meta?: ReactNode;
};

// Fully-controlled footer for server-driven tables.
// Pagination display is driven by backend props, not TanStack Table state.
export const ServerFooter = ({
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  meta,
}: TProps) => {
  const t = useTranslations("dataTable.pagination");
  const range = getPaginationRange(page, totalPages);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="border-border bg-muted/50 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3.5">
      <div className="min-w-0 flex-1">{meta}</div>

      <div className="flex items-center gap-3">
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger size="sm" className="w-auto" aria-label={t("perPageLabel")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {t("perPage", { count: size })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canPrev) onPageChange(page - 1);
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
                  if (canNext) onPageChange(page + 1);
                }}
                className={cn(!canNext && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
