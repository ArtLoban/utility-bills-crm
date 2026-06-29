"use client";

import { DateRangeFilter } from "@/components/date-range-filter";
import { Form } from "@/components/ui/form";

import type { TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
};

export const FilterFields = ({ queryFilters }: TProps) => {
  const { form, values } = queryFilters;

  return (
    <Form {...form}>
      <div className="flex flex-col gap-3">
        <DateRangeFilter form={form} values={values} orientation="stacked" />
      </div>
    </Form>
  );
};
