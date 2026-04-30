import type { TMeter } from "@/components/reading-modal/types";
import type { TServiceKey } from "@/lib/constants/service-colors";

export type TContractInfo = {
  provider: string;
  inEffectSince: string;
  accountNumber: string;
  tariffType: string;
  tariffRates: Array<{ label: string; rate: string; unit: string; color: string }>;
  paymentDetails: string;
};

export type TMeterInfo = {
  serialNumber: string;
  type: string;
  installed: string;
  lastReadingDate: string;
  zones: Array<{ label: string; value: string; unit: string; color: string }>;
};

export type TActivityItem = {
  type: "bill" | "payment";
  period: string;
  date: string;
  amount: number;
  note?: string;
};

export type TServiceDetail = {
  serviceKey: TServiceKey;
  name: string;
  providerShort: string;
  propertyName: string;
  balance: number;
  contract: TContractInfo;
  meter: TMeterInfo;
  activity: TActivityItem[];
  notes: string;
};

export type TTariffPeriod = {
  range: string;
  t1: string;
  t2?: string;
};

export type TContractEra = {
  id: number;
  range: string;
  isCurrent: boolean;
  provider: string;
  accountNumber: string;
  tariffZones: 1 | 2;
  tariffs: TTariffPeriod[];
  paymentDetails: string;
};

export const MOCK_SERVICE_DETAIL: TServiceDetail = {
  serviceKey: "electricity",
  name: "Electricity",
  providerShort: "ДТЭК",
  propertyName: "Apartment on Main St",
  balance: -1240.5,
  contract: {
    provider: "ДТЭК Київські електромережі",
    inEffectSince: "Mar 1, 2024",
    accountNumber: "UA21 3006 5000 0002 6007 3300 1",
    tariffType: "Two-zone (T1/T2)",
    tariffRates: [
      { label: "T1 · Day", rate: "4.32", unit: "₴/kWh", color: "#f59e0b" },
      { label: "T2 · Night", rate: "2.16", unit: "₴/kWh", color: "#6366f1" },
    ],
    paymentDetails:
      "Bank: ПАТ КБ «ПРИВАТБАНК»\nMFO: 305299\nEDRPOU: 23494714\nAccount: UA21 3006 5000 0002 6007 3300 1\nPurpose: Payment for electricity services",
  },
  meter: {
    serialNumber: "NIK2303-11-456789",
    type: "Two-zone electronic",
    installed: "Jan 15, 2021",
    lastReadingDate: "Oct 22, 2025",
    zones: [
      { label: "T1 · Day", value: "8,432", unit: "kWh", color: "#f59e0b" },
      { label: "T2 · Night", value: "3,210", unit: "kWh", color: "#6366f1" },
    ],
  },
  activity: [
    { type: "bill", period: "Oct 2025", date: "Nov 10, 2025", amount: 1240.5 },
    { type: "payment", period: "Sep 2025", date: "Oct 28, 2025", amount: 980.0 },
    { type: "bill", period: "Sep 2025", date: "Oct 10, 2025", amount: 980.0 },
    { type: "payment", period: "Aug 2025", date: "Sep 27, 2025", amount: 1105.2 },
    { type: "bill", period: "Aug 2025", date: "Sep 10, 2025", amount: 1105.2, note: "Peak season" },
    { type: "payment", period: "Jul 2025", date: "Aug 25, 2025", amount: 870.4 },
  ],
  notes:
    "Two-zone meter installed during the 2021 renovation.\nMetered separately from the common areas.\nMeter located in the hallway utility box — key with building manager.",
};

export const MOCK_CONTRACT_HISTORY: TContractEra[] = [
  {
    id: 1,
    range: "Mar 2024 — present",
    isCurrent: true,
    provider: "ДТЭК Київські електромережі",
    accountNumber: "UA21 3006 5000 0002 6007 3300 1",
    tariffZones: 2,
    tariffs: [
      { range: "Nov 2024 — present", t1: "4.32 ₴/kWh", t2: "2.16 ₴/kWh" },
      { range: "Mar 2024 — Oct 2024", t1: "3.60 ₴/kWh", t2: "1.80 ₴/kWh" },
    ],
    paymentDetails: "UA21 3006 5000 0002 6007 3300 1 · ПриватБанк",
  },
  {
    id: 2,
    range: "Jan 2022 — Feb 2024",
    isCurrent: false,
    provider: "Київенерго",
    accountNumber: "KE-00482-77",
    tariffZones: 1,
    tariffs: [
      { range: "Jul 2023 — Feb 2024", t1: "2.64 ₴/kWh" },
      { range: "Jan 2022 — Jun 2023", t1: "1.68 ₴/kWh" },
    ],
    paymentDetails: "KE-00482-77 · Ощадбанк",
  },
  {
    id: 3,
    range: "Jun 2019 — Dec 2021",
    isCurrent: false,
    provider: "Київенерго",
    accountNumber: "KE-00482-77",
    tariffZones: 1,
    tariffs: [{ range: "Jun 2019 — Dec 2021", t1: "1.44 ₴/kWh" }],
    paymentDetails: "KE-00482-77 · Ощадбанк",
  },
];

export const MOCK_METER_FOR_READING: TMeter = {
  serialNumber: "NIK2303-11-456789",
  serviceKey: "electricity",
  propertyName: "Apartment on Main St",
  zones: 2,
  lastReadingValue: 0,
  lastReadingDate: "Oct 22, 2025",
  unit: "kWh",
  lastReadingT1: 8432,
  lastReadingT2: 3210,
};
