"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "../../../constants";
import { useDataTablePagination } from "../../../hooks/use-data-table-pagination";

type TProps = {
  value: number;
};

export const PageSizeSelector = ({ value }: TProps) => {
  const t = useTranslations("dataTable.pagination");
  const { setPageSize } = useDataTablePagination();

  const handleSizeChange = (size: string | null) => {
    setPageSize(size ? Number(size) : DEFAULT_PAGE_SIZE);
  };

  return (
    <Select value={String(value)} onValueChange={handleSizeChange}>
      <SelectTrigger size="sm" className="w-auto" aria-label={t("perPageLabel")}>
        <SelectValue>{t("perPage", { count: value })}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {t("perPage", { count: size })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
