"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { SYSTEM_ROLES } from "@/lib/auth/constants";
import { PAGE_DEFAULT } from "@/components/data-table/constants";

type TFilterForm = {
  systemRole: string | null;
  status: string | null;
};

const EMPTY_FILTERS: TFilterForm = { systemRole: null, status: null };

export const FiltersBar = () => {
  const [query, setQuery] = useQueryStates(
    {
      systemRole: parseAsString,
      status: parseAsString,
      page: parseAsInteger.withDefault(PAGE_DEFAULT),
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
      page: PAGE_DEFAULT,
    });
  }, [values, setQuery]);

  const hasActiveFilters = Boolean(values.systemRole || values.status);
  const handleClear = () => form.reset(EMPTY_FILTERS);

  const roleOptions = [
    { id: SYSTEM_ROLES.ADMIN, name: "Admin" },
    { id: SYSTEM_ROLES.USER, name: "User" },
  ];

  // null = "Active" (default, no explicit param). Options expose non-default statuses only.
  const statusOptions = [
    { id: "deleted", name: "Deleted" },
    { id: "all", name: "All users" },
  ];

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <SelectInput form={form} field="systemRole" label="Role" options={roleOptions} />
      <SelectInput form={form} field="status" label="Status" options={statusOptions} />
    </TableFilters>
  );
};
