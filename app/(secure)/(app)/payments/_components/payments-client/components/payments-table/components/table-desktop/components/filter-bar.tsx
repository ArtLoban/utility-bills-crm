"use client";

import { useTranslations } from "next-intl";

import { DateRangeFilter } from "@/components/date-range-filter";
import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";

import { FiltersFormField, TQueryFilters } from "../../../types";
import { usePaymentsTable } from "@/app/(secure)/(app)/payments/_components/payments-client/context";

type TProps = {
  queryFilters: TQueryFilters;
};

export const FilterBar = ({ queryFilters }: TProps) => {
  const t = useTranslations("payments.list.filters");
  const { form, values, hasActiveFilters, handleClear } = queryFilters;
  const { properties } = usePaymentsTable();
  const serviceOptions = useServiceOptions();

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <DateRangeFilter form={form} values={values} />
      <SelectInput
        form={form}
        field={FiltersFormField.PROPERTY_ID}
        label={t("property")}
        options={properties}
        size="sm"
      />
      <SelectInput
        form={form}
        field={FiltersFormField.SERVICES}
        label={t("service")}
        options={serviceOptions}
        size="sm"
      />
    </TableFilters>
  );
};
