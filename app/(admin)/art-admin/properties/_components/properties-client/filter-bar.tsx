"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { PAGE_DEFAULT } from "@/components/data-table/constants";

type TFilterForm = {
  status: string | null;
  type: string | null;
};

const EMPTY_FILTERS: TFilterForm = { status: null, type: null };

type TProps = {
  ownerName: string | null;
};

export const FilterBar = ({ ownerName }: TProps) => {
  const t = useTranslations("adminProperties");

  const [query, setQuery] = useQueryStates(
    {
      status: parseAsString,
      type: parseAsString,
      owner: parseAsString,
      page: parseAsInteger.withDefault(PAGE_DEFAULT),
    },
    { history: "replace", shallow: false },
  );

  const form = useForm<TFilterForm>({
    defaultValues: { status: query.status, type: query.type },
  });

  const values = useWatch({ control: form.control });

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    void setQuery({
      status: values.status ?? null,
      type: values.type ?? null,
      page: PAGE_DEFAULT,
    });
  }, [values, setQuery]);

  const hasActiveFilters = Boolean(values.status || values.type || query.owner);

  const handleClear = () => {
    form.reset(EMPTY_FILTERS);
    void setQuery({ status: null, type: null, owner: null, page: PAGE_DEFAULT });
  };

  const statusOptions = [
    { id: "deleted", name: t("filters.statusDeleted") },
    { id: "all", name: t("filters.statusAll") },
  ];

  const typeOptions = [
    { id: "apartment", name: t("filters.typeApartment") },
    { id: "house", name: t("filters.typeHouse") },
    { id: "cottage", name: t("filters.typeCottage") },
    { id: "other", name: t("filters.typeOther") },
  ];

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <SelectInput form={form} field="status" label={t("filters.status")} options={statusOptions} />
      <SelectInput form={form} field="type" label={t("filters.type")} options={typeOptions} />

      {ownerName && (
        <div className="border-brand bg-brand-bg text-brand flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-sm">
          <span>
            {t("filters.owner")}: <span className="font-medium">{ownerName}</span>
          </span>
          <button
            type="button"
            aria-label={t("filters.clearOwner")}
            onClick={() => void setQuery({ owner: null, page: PAGE_DEFAULT })}
            className="hover:opacity-70"
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>
      )}
    </TableFilters>
  );
};
