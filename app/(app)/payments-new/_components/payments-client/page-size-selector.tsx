"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants/common";

type TProps = {
  value: number;
  onChange: (size: number) => void;
};

export const PageSizeSelector = ({ value, onChange }: TProps) => {
  const t = useTranslations("dataTable.pagination");
  const label = t("perPage", { count: value });

  return (
    <Select value={label} onValueChange={(value) => onChange(Number(value))}>
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
