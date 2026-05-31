"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";

import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { FIRST_PAGE_INDEX_DEFAULT } from "@/components/data-table/data-table/constants";
import { SYSTEM_ROLES } from "@/lib/auth/constants";

type TFilterForm = {
  systemRole: string | null;
  status: string | null;
};

const EMPTY_FILTERS: TFilterForm = { systemRole: null, status: null };

export const FiltersBar = () => {
  const t = useTranslations("adminUsers");

  const [query, setQuery] = useQueryStates(
    {
      systemRole: parseAsString,
      status: parseAsString,
      page: parseAsInteger.withDefault(FIRST_PAGE_INDEX_DEFAULT),
    },
    { history: "replace", shallow: false },
  );

  const form = useForm<TFilterForm>({
    defaultValues: { systemRole: query.systemRole, status: query.status },
  });

  const values = useWatch({ control: form.control });

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    void setQuery({
      systemRole: values.systemRole ?? null,
      status: values.status ?? null,
      page: FIRST_PAGE_INDEX_DEFAULT,
    });
  }, [values, setQuery]);

  const hasActiveFilters = Boolean(values.systemRole || values.status);
  const handleClear = () => form.reset(EMPTY_FILTERS);

  const roleOptions = [
    { id: SYSTEM_ROLES.ADMIN, name: t("filters.roleAdmin") },
    { id: SYSTEM_ROLES.USER, name: t("filters.roleUser") },
  ];

  // null = "Active" (default, no explicit param). Options expose non-default statuses only.
  const statusOptions = [
    { id: "deleted", name: t("filters.statusDeleted") },
    { id: "all", name: t("filters.statusAll") },
  ];

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <SelectInput form={form} field="systemRole" label={t("filters.role")} options={roleOptions} />
      <SelectInput form={form} field="status" label={t("filters.status")} options={statusOptions} />
    </TableFilters>
  );
};
