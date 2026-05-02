import type { TServiceKey } from "@/lib/constants/service-colors";

export type TMeterListItem = {
  id: string;
  serviceKey: TServiceKey;
  serviceName: string;
  serialNumber: string;
  zonesLabel: string;
};

export const MOCK_METERS: TMeterListItem[] = [
  {
    id: "mid-1",
    serviceKey: "electricity",
    serviceName: "Electricity meter",
    serialNumber: "NIK-12345",
    zonesLabel: "Two-zone",
  },
  {
    id: "mid-2",
    serviceKey: "gas",
    serviceName: "Gas meter",
    serialNumber: "G-98765",
    zonesLabel: "Single zone",
  },
];

export const SERVICE_TYPE_OPTIONS = [
  { value: "electricity", label: "Electricity" },
  { value: "gas", label: "Gas" },
  { value: "coldWater", label: "Cold water" },
  { value: "hotWater", label: "Hot water" },
  { value: "heating", label: "Heating" },
  { value: "internet", label: "Internet" },
] as const;

export const ZONE_OPTIONS = [
  { value: "single", label: "Single zone" },
  { value: "two", label: "Two zones (day / night)" },
  { value: "three", label: "Three zones (peak / shoulder / off-peak)" },
] as const;
