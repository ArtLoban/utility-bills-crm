export const ReadingFormField = {
  READ_AT: "readAt",
  VALUE_T1: "valueT1",
  VALUE_T2: "valueT2",
  VALUE_T3: "valueT3",
  NOTES: "notes",
} as const;

export const READING_ZONES = [
  { field: ReadingFormField.VALUE_T1, zone: "T1", suffixKey: "day" },
  { field: ReadingFormField.VALUE_T2, zone: "T2", suffixKey: "night" },
  { field: ReadingFormField.VALUE_T3, zone: "T3", suffixKey: "peak" },
] as const;

export type TReadingZone = (typeof READING_ZONES)[number];
export type TZoneField = TReadingZone["field"];

export type TZoneState = {
  lastValue: number | null;
  warning: boolean;
  delta: number | null;
};
