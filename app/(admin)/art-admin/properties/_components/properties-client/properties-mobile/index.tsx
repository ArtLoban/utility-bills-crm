"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { TAdminPropertyRow } from "@/features/admin-properties";
import type { TServerPagination } from "@/lib/types/data-table";

import { PropertyCard } from "./property-card";

type TProps = {
  data: TAdminPropertyRow[];
  pagination: TServerPagination;
  onPageChange: (page: number) => void;
};

export const PropertiesMobile = ({ data, pagination, onPageChange }: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [query, setQuery] = useQueryStates(
    { status: parseAsString, type: parseAsString, owner: parseAsString },
    { history: "replace", shallow: false },
  );

  const activeCount = [query.status, query.type, query.owner].filter(Boolean).length;

  const handleClear = () => {
    void setQuery({ status: null, type: null, owner: null });
    setSheetOpen(false);
  };

  const statusOptions = [
    { id: "deleted", name: "Deleted" },
    { id: "all", name: "All" },
  ];

  const typeOptions = [
    { id: "apartment", name: "Apartment" },
    { id: "house", name: "House" },
    { id: "cottage", name: "Cottage" },
    { id: "other", name: "Other" },
  ];

  const prevDisabled = pagination.page <= 1;
  const nextDisabled = pagination.page >= pagination.totalPages;

  return (
    <div className="px-3.5 pt-3 pb-8">
      <div className={`flex items-center justify-between ${activeCount > 0 ? "mb-2.5" : "mb-3.5"}`}>
        <button
          onClick={() => setSheetOpen(true)}
          className={
            activeCount === 0
              ? "border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              : "border-brand bg-brand-bg text-brand border"
          }
          style={{
            height: 32,
            padding: "0 12px",
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 6,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
        >
          Filters
          {activeCount > 0 && (
            <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        <span className="text-muted-foreground text-xs">
          {pagination.total === 1 ? "1 property" : `${pagination.total} properties`}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {data.map((row) => (
          <PropertyCard key={row.id} row={row} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-3.5">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={prevDisabled}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            style={{
              cursor: prevDisabled ? "default" : "pointer",
              opacity: prevDisabled ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={14} className="text-zinc-950 dark:text-zinc-50" />
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Page <strong className="text-zinc-950 dark:text-zinc-50">{pagination.page}</strong> of{" "}
            {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={nextDisabled}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            style={{
              cursor: nextDisabled ? "default" : "pointer",
              opacity: nextDisabled ? 0.4 : 1,
            }}
          >
            <ChevronRight size={14} className="text-zinc-950 dark:text-zinc-50" />
          </button>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" showCloseButton={false} className="gap-0 rounded-t-[14px] p-0">
          <div className="flex justify-center pt-2.5">
            <div className="h-1 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="px-4 pb-6">
            <div className="flex items-center justify-between py-3">
              <SheetTitle>Filters</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Close">
                  <X size={16} className="text-muted-foreground" />
                </Button>
              </SheetClose>
            </div>

            <div className="flex flex-col gap-3.5">
              {[
                {
                  label: "Status",
                  value: query.status,
                  key: "status",
                  options: statusOptions,
                  placeholder: "Active (default)",
                },
                {
                  label: "Type",
                  value: query.type,
                  key: "type",
                  options: typeOptions,
                  placeholder: "All types",
                },
              ].map(({ label, value, key, options, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">{label}</label>
                  <Select
                    value={value || ""}
                    onValueChange={(v) => void setQuery({ [key]: v === "__clear__" ? null : v })}
                  >
                    <SelectTrigger className="w-full rounded-lg">
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__clear__">{placeholder}</SelectItem>
                      {options.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2.5">
              <Button variant="outline" className="flex-1" onClick={handleClear}>
                Clear filters
              </Button>
              <Button className="flex-[2]" onClick={() => setSheetOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
