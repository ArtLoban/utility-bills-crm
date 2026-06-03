"use client";

import { DateRangeInput } from "./components/date-range-input";

type TDateRangeForm = {
  setValue: (
    name: "dateFrom" | "dateTo",
    value: string | null,
    options?: { shouldDirty?: boolean },
  ) => void;
};

type TProps = {
  form: TDateRangeForm;
  values: { dateFrom?: string | null; dateTo?: string | null };
};

export const DateRangeFilter = ({ form, values }: TProps) => {
  return (
    <DateRangeInput
      dateFrom={values.dateFrom ?? null}
      dateTo={values.dateTo ?? null}
      onChange={(from, to) => {
        form.setValue("dateFrom", from, { shouldDirty: true });
        form.setValue("dateTo", to, { shouldDirty: true });
      }}
    />
  );
};
