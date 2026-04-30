import type { TServiceKey } from "@/lib/constants/service-colors";

export type TReadingZones = 1 | 2;

export type TMeter = {
  serialNumber: string;
  serviceKey: TServiceKey;
  propertyName: string;
  zones: TReadingZones;
  lastReadingValue: number;
  lastReadingDate: string;
  unit: string;
  lastReadingT1?: number;
  lastReadingT2?: number;
};

export type TReadingFormState = {
  date: string;
  value: string;
  valueT1: string;
  valueT2: string;
  notes: string;
};

export type TReadingResult = {
  date: string;
  value?: number;
  valueT1?: number;
  valueT2?: number;
  notes: string;
};
