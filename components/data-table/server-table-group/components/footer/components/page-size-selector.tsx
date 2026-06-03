"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/components/data-table/constants";

type TProps = {
  value: number;
  onChange: (size: number) => void;
};

export const PageSizeSelector = ({ value, onChange }: TProps) => {
  const t = useTranslations("dataTable.pagination");

  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
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
  );
};
