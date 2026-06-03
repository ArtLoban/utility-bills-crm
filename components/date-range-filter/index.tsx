"use client";

import { DateRangeInput } from "./components/date-range-input";
import { DATE_PARAMS } from "@/lib/types/common";

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
      dateFrom={values[DATE_PARAMS.DATE_FROM] ?? null}
      dateTo={values[DATE_PARAMS.DATE_TO] ?? null}
      onChange={(from, to) => {
        form.setValue(DATE_PARAMS.DATE_FROM, from, { shouldDirty: true });
        form.setValue(DATE_PARAMS.DATE_TO, to, { shouldDirty: true });
      }}
    />
  );
};
