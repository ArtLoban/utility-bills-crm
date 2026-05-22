"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type TProps = {
  children: ReactNode;
  hasActiveFilters?: boolean;
  onClear: () => void;
};

export const TableFilters = ({ children, hasActiveFilters, onClear }: TProps) => {
  const t = useTranslations("dataTable.filters");

  return (
    <div className="border-border bg-background mb-4 flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2">
      <span className="pl-0.5 text-sm">{t("label")}</span>
      <div className="flex flex-wrap gap-3">{children}</div>
      <Button
        variant="outline"
        onClick={onClear}
        disabled={!hasActiveFilters}
        className="font-normal"
      >
        {t("clear")}
      </Button>
    </div>
  );
};
