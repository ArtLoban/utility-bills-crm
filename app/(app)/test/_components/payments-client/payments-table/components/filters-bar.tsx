import { TableFilters } from "@/components/feature/data-table/table-filters";
import { useForm, useWatch } from "react-hook-form";
import { SelectInput } from "@/components/select-input";
import { useEffect } from "react";
import { PAYMENT_PROPERTIES, PAYMENT_SERVICES } from "@/app/(app)/payments/_data/mock";
import {
  FiltersFormField,
  TFiltersFormValues,
} from "@/app/(app)/test/_components/payments-client/payments-table/types";
import { parseAsInteger, useQueryStates } from "nuqs";
import {
  INITIAL_FILTERS,
  URL_FIELDS,
} from "@/app/(app)/test/_components/payments-client/payments-table/constants";
import { getInitialValuesFromUrl } from "@/components/feature/data-table/data-table/utils/get-initial-values-from-url";
import { FIRST_PAGE_INDEX_DEFAULT } from "@/components/feature/data-table/data-table/constants";
import { DataTableField } from "@/components/feature/data-table/data-table/types";

const PERIOD_OPTIONS = [
  { id: "last3", name: "Last 3 months" },
  { id: "last6", name: "Last 6 months" },
  { id: "last12", name: "Last 12 months" },
];

export const FiltersBar = () => {
  const [query, setQuery] = useQueryStates({
    ...URL_FIELDS,
    [DataTableField.PAGE]: parseAsInteger.withDefault(FIRST_PAGE_INDEX_DEFAULT),
  });
  const form = useForm<TFiltersFormValues>({
    defaultValues: getInitialValuesFromUrl(query, Object.values(FiltersFormField), INITIAL_FILTERS),
  });
  const values = useWatch({
    control: form.control,
  });

  useEffect(() => {
    console.log("values", values);
    void setQuery({
      ...values,
      [DataTableField.PAGE]: FIRST_PAGE_INDEX_DEFAULT,
    });
  }, [values, setQuery]);

  const handleClear = () => form.reset(INITIAL_FILTERS);

  const hasActiveFilters = Object.values(values).some(Boolean);

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <SelectInput
        form={form}
        field={FiltersFormField.PROPERTY}
        label="Property"
        options={PAYMENT_PROPERTIES}
      />
      <SelectInput
        form={form}
        field={FiltersFormField.SERVICE}
        label="Service"
        options={PAYMENT_SERVICES}
      />
      <SelectInput
        form={form}
        field={FiltersFormField.PAID_AT}
        label="Period"
        options={PERIOD_OPTIONS}
      />
    </TableFilters>
  );
};
