"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { DateRangeFilter } from "@/components/date-range-filter";
import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { PAGE_DEFAULT } from "@/components/data-table/constants";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";
import { TSelectableEntity } from "@/components/select-input/types";

type TProps = {
  propertyOptions: TSelectableEntity[];
};

type TFilterForm = {
  propertyId: string | null;
  service: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

const EMPTY_FILTERS: TFilterForm = {
  propertyId: null,
  service: null,
  dateFrom: null,
  dateTo: null,
};

export const FilterBar = ({ propertyOptions }: TProps) => {
  const serviceOptions = useServiceOptions();
  const [query, setQuery] = useQueryStates(
    {
      propertyId: parseAsString,
      service: parseAsString,
      dateFrom: parseAsString,
      dateTo: parseAsString,
      page: parseAsInteger.withDefault(PAGE_DEFAULT),
    },
    { history: "replace", shallow: false },
  );

  const form = useForm<TFilterForm>({
    defaultValues: {
      propertyId: query.propertyId,
      service: query.service,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    },
  });

  const values = useWatch({ control: form.control });

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    void setQuery({
      propertyId: values.propertyId ?? null,
      service: values.service ?? null,
      dateFrom: values.dateFrom ?? null,
      dateTo: values.dateTo ?? null,
      page: PAGE_DEFAULT,
    });
  }, [values, setQuery]);

  const hasActiveFilters = Boolean(
    values.propertyId || values.service || values.dateFrom || values.dateTo,
  );

  const handleClear = () => form.reset(EMPTY_FILTERS);

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <SelectInput form={form} field="propertyId" label="Property" options={propertyOptions} />
      <SelectInput form={form} field="service" label="Service" options={serviceOptions} />
      <DateRangeFilter form={form} values={values} />
    </TableFilters>
  );
};
