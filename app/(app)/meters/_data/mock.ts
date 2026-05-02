import type { TServiceKey } from "@/lib/constants/service-colors";

export type TMeterProperty = {
  id: string;
  name: string;
};

export type TMeterLastReading = {
  date: string;
  values: number[];
};

export type TGlobalMeter = {
  id: string;
  serial: string;
  zones: number;
  installedAt: string;
  installedAtMs: number;
  removedAt: string | null;
  property: TMeterProperty;
  serviceKey: TServiceKey;
  unit: string | null;
  lastReading: TMeterLastReading | null;
  propertyRole: "owner" | "editor" | "viewer";
};

export type TMeterStatus = "active" | "historical" | "all";

export type TFilterState = {
  property: string;
  service: string;
  status: TMeterStatus;
};

export const METER_PROPERTIES: TMeterProperty[] = [
  { id: "p1", name: "Apartment on Main St" },
  { id: "p2", name: "Mom's apartment" },
  { id: "p3", name: "Summer house" },
];

const d = (s: string): number => new Date(s).getTime();

export const ALL_METERS: TGlobalMeter[] = [
  {
    id: "m-p1-elec",
    serial: "NIK-2230-TZ",
    zones: 2,
    installedAt: "Mar 15, 2022",
    installedAtMs: d("Mar 15, 2022"),
    removedAt: null,
    property: { id: "p1", name: "Apartment on Main St" },
    serviceKey: "electricity",
    unit: "kWh",
    lastReading: { date: "Apr 20, 2025", values: [14521, 8310] },
    propertyRole: "owner",
  },
  {
    id: "m-p1-gas",
    serial: "DISP-0034",
    zones: 1,
    installedAt: "Mar 15, 2022",
    installedAtMs: d("Mar 15, 2022"),
    removedAt: null,
    property: { id: "p1", name: "Apartment on Main St" },
    serviceKey: "gas",
    unit: "m³",
    lastReading: { date: "Apr 20, 2025", values: [2430] },
    propertyRole: "owner",
  },
  {
    id: "m-p1-cw",
    serial: "WS-4490-A",
    zones: 1,
    installedAt: "Mar 15, 2022",
    installedAtMs: d("Mar 15, 2022"),
    removedAt: null,
    property: { id: "p1", name: "Apartment on Main St" },
    serviceKey: "coldWater",
    unit: "m³",
    lastReading: { date: "Apr 18, 2025", values: [347] },
    propertyRole: "owner",
  },
  {
    id: "m-p1-hw",
    serial: "WS-4491-A",
    zones: 1,
    installedAt: "Mar 15, 2022",
    installedAtMs: d("Mar 15, 2022"),
    removedAt: null,
    property: { id: "p1", name: "Apartment on Main St" },
    serviceKey: "hotWater",
    unit: "m³",
    lastReading: { date: "Apr 18, 2025", values: [182] },
    propertyRole: "owner",
  },
  {
    id: "m-p2-elec",
    serial: "NIK-1185-TZ",
    zones: 1,
    installedAt: "Jun 1, 2020",
    installedAtMs: d("Jun 1, 2020"),
    removedAt: null,
    property: { id: "p2", name: "Mom's apartment" },
    serviceKey: "electricity",
    unit: "kWh",
    lastReading: { date: "Apr 15, 2025", values: [29840] },
    propertyRole: "editor",
  },
  {
    id: "m-p2-gas",
    serial: "DISP-8812",
    zones: 1,
    installedAt: "Jun 1, 2020",
    installedAtMs: d("Jun 1, 2020"),
    removedAt: null,
    property: { id: "p2", name: "Mom's apartment" },
    serviceKey: "gas",
    unit: "m³",
    lastReading: null,
    propertyRole: "editor",
  },
  {
    id: "m-p3-elec-old",
    serial: "NIK-0044-LN",
    zones: 1,
    installedAt: "Apr 5, 2019",
    installedAtMs: d("Apr 5, 2019"),
    removedAt: "Jan 10, 2025",
    property: { id: "p3", name: "Summer house" },
    serviceKey: "electricity",
    unit: "kWh",
    lastReading: { date: "Oct 30, 2024", values: [8201] },
    propertyRole: "owner",
  },
  {
    id: "m-p3-elec",
    serial: "NIK-5572-LN",
    zones: 1,
    installedAt: "Jan 10, 2025",
    installedAtMs: d("Jan 10, 2025"),
    removedAt: null,
    property: { id: "p3", name: "Summer house" },
    serviceKey: "electricity",
    unit: "kWh",
    lastReading: { date: "Apr 10, 2025", values: [427] },
    propertyRole: "owner",
  },
];

export const SERVICE_ORDER: Partial<Record<TServiceKey, number>> = {
  electricity: 0,
  gas: 1,
  coldWater: 2,
  hotWater: 3,
  heating: 4,
  internet: 5,
};
