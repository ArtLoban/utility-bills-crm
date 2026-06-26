import { todayIso, toIsoDate } from "@/lib/format/date";
import type { TReading } from "@/lib/db/schema/readings";
import type { TReadingFormValues } from "../schema";
import { ReadingFormField } from "../types";

export const buildDefaultValues = (reading?: TReading): TReadingFormValues => ({
  [ReadingFormField.READ_AT]: reading ? toIsoDate(new Date(reading.readAt)) : todayIso(),
  [ReadingFormField.VALUE_T1]: reading ? String(reading.valueT1) : "",
  [ReadingFormField.VALUE_T2]: reading?.valueT2 != null ? String(reading.valueT2) : "",
  [ReadingFormField.VALUE_T3]: reading?.valueT3 != null ? String(reading.valueT3) : "",
  [ReadingFormField.NOTES]: reading?.notes ?? "",
});
