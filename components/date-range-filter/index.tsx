"use client";

import { DateRangeInput } from "./components/date-range-input";
import type { TDateRangeOrientation } from "./types";
import { DATE_PARAMS, TDateParam } from "@/lib/types/common";

type TDateRangeForm = {
  setValue: (name: TDateParam, value: string | null, options?: { shouldDirty?: boolean }) => void;
};

type TProps = {
  form: TDateRangeForm;
  values: {
    [DATE_PARAMS.DATE_FROM]?: string | null;
    [DATE_PARAMS.DATE_TO]?: string | null;
  };
  orientation?: TDateRangeOrientation;
};

export const DateRangeFilter = ({ form, values, orientation }: TProps) => {
  return (
    <DateRangeInput
      dateFrom={values[DATE_PARAMS.DATE_FROM] ?? null}
      dateTo={values[DATE_PARAMS.DATE_TO] ?? null}
      orientation={orientation}
      onChange={(from, to) => {
        form.setValue(DATE_PARAMS.DATE_FROM, from, { shouldDirty: true });
        form.setValue(DATE_PARAMS.DATE_TO, to, { shouldDirty: true });
      }}
    />
  );
};
