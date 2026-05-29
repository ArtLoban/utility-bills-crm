import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { parseAsInteger, useQueryStates } from "nuqs";

import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { FIRST_PAGE_INDEX_DEFAULT } from "@/components/data-table/data-table/constants";
import { DATA_TABLE_PARAMS } from "@/components/data-table/data-table/types";
import { getInitialValuesFromUrl } from "@/components/data-table/data-table/utils/get-initial-values-from-url";
import { TSelectableEntity } from "@/components/select-input/types";

import { INITIAL_FILTERS, URL_FIELDS } from "../constants";
import { FiltersFormField, TFiltersFormValues } from "../types";

const ROLE_OPTIONS: TSelectableEntity[] = [
  { id: "admin", name: "Admin" },
  { id: "user", name: "User" },
];

const STATUS_OPTIONS: TSelectableEntity[] = [
  { id: "active", name: "Active" },
  { id: "deleted", name: "Deleted" },
];

export const FiltersBar = () => {
  const [query, setQuery] = useQueryStates({
    ...URL_FIELDS,
    [DATA_TABLE_PARAMS.PAGE]: parseAsInteger.withDefault(FIRST_PAGE_INDEX_DEFAULT),
  });

  const form = useForm<TFiltersFormValues>({
    defaultValues: getInitialValuesFromUrl(query, Object.values(FiltersFormField), INITIAL_FILTERS),
  });

  const values = useWatch({ control: form.control });

  useEffect(() => {
    void setQuery({ ...values, [DATA_TABLE_PARAMS.PAGE]: FIRST_PAGE_INDEX_DEFAULT });
  }, [values, setQuery]);

  const handleClear = () => form.reset(INITIAL_FILTERS);

  const hasActiveFilters = Object.values(values).some(Boolean);

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <SelectInput form={form} field={FiltersFormField.ROLE} label="Role" options={ROLE_OPTIONS} />
      <SelectInput
        form={form}
        field={FiltersFormField.STATUS}
        label="Status"
        options={STATUS_OPTIONS}
      />
    </TableFilters>
  );
};
