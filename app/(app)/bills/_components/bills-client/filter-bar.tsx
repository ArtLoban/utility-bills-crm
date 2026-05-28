"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { FIRST_PAGE_INDEX_DEFAULT } from "@/components/data-table/data-table/constants";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  propertyOptions: { id: PropertyId; name: string }[];
  serviceOptions: { id: string; name: string }[];
};

type TFilterForm = {
  propertyId: string | null;
  service: string | null;
  period: string | null;
};

const PERIOD_OPTIONS = [
  { id: "last3", name: "Last 3 months" },
  { id: "last6", name: "Last 6 months" },
  { id: "last12", name: "Last 12 months" },
] as const;

const EMPTY_FILTERS: TFilterForm = { propertyId: null, service: null, period: null };

export const FilterBar = ({ propertyOptions, serviceOptions }: TProps) => {
  const [query, setQuery] = useQueryStates(
    {
      propertyId: parseAsString,
      service: parseAsString,
      period: parseAsString,
      page: parseAsInteger.withDefault(FIRST_PAGE_INDEX_DEFAULT),
    },
    { history: "replace", shallow: false },
  );

  const form = useForm<TFilterForm>({
    defaultValues: {
      propertyId: query.propertyId,
      service: query.service,
      period: query.period,
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
      period: values.period ?? null,
      page: FIRST_PAGE_INDEX_DEFAULT,
    });
  }, [values, setQuery]);

  const hasActiveFilters = Boolean(values.propertyId || values.service || values.period);

  const handleClear = () => form.reset(EMPTY_FILTERS);

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <SelectInput form={form} field="propertyId" label="Property" options={propertyOptions} />
      <SelectInput form={form} field="service" label="Service" options={serviceOptions} />
      <SelectInput form={form} field="period" label="Period" options={[...PERIOD_OPTIONS]} />
    </TableFilters>
  );
};
