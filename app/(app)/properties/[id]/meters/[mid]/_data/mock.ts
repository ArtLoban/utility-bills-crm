import type { TMeter } from "@/components/reading-modal/types";

export type TMeterDetail = {
  serialNumber: string;
  serviceType: string;
  propertyName: string;
  zones: number;
  zoneLabels: string;
  installedAt: string;
  activeSince: string;
  notes: string;
};

export type TReading = {
  date: string;
  t1: number;
  t2: number;
  d1: number | null;
  d2: number | null;
  note: string;
};

export const MOCK_METER_DETAIL: TMeterDetail = {
  serialNumber: "NIK-12345",
  serviceType: "electricity",
  propertyName: "Main apartment",
  zones: 2,
  zoneLabels: "T1 day, T2 night",
  installedAt: "March 15, 2024",
  activeSince: "March 15, 2024",
  notes: "Located in the entrance hall, behind the door panel.",
};

export const MOCK_READINGS: TReading[] = [
  { date: "Apr 15, 2026", t1: 24847, t2: 8142, d1: 312, d2: 98, note: "" },
  { date: "Mar 15, 2026", t1: 24535, t2: 8044, d1: 287, d2: 101, note: "" },
  { date: "Feb 15, 2026", t1: 24248, t2: 7943, d1: 298, d2: 95, note: "Took during cold spell" },
  { date: "Jan 15, 2026", t1: 23950, t2: 7848, d1: 321, d2: 112, note: "" },
  { date: "Dec 15, 2025", t1: 23629, t2: 7736, d1: 275, d2: 89, note: "" },
  { date: "Nov 15, 2025", t1: 23354, t2: 7647, d1: 268, d2: 92, note: "" },
  { date: "Oct 15, 2025", t1: 23086, t2: 7555, d1: 245, d2: 84, note: "" },
  { date: "Sep 15, 2025", t1: 22841, t2: 7471, d1: 231, d2: 78, note: "" },
  { date: "Aug 15, 2025", t1: 22610, t2: 7393, d1: null, d2: null, note: "" },
];

export const MOCK_METER_FOR_READING: TMeter = {
  serialNumber: "NIK-12345",
  serviceKey: "electricity",
  propertyName: "Main apartment",
  zones: 2,
  lastReadingValue: 0,
  lastReadingDate: "Apr 15, 2026",
  unit: "kWh",
  lastReadingT1: 24847,
  lastReadingT2: 8142,
};
