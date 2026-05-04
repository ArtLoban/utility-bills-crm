import { TServiceKey } from "@/lib/constants/service-colors";

export type TPaymentProperty = {
  id: string;
  name: string;
  shortName: string;
};

export type TPaymentService = {
  id: TServiceKey;
  name: string;
  unit: string | null;
};

export type TPayment = {
  id: number;
  paidAt: string;
  sortTs: number;
  property: TPaymentProperty;
  service: TPaymentService;
  amount: number;
  notes?: string;
};

export type TSortColumn = "date" | "property" | "service" | "amount";
export type TSortDir = "asc" | "desc";

export type TFilterState = {
  property: string;
  service: string;
  period: string;
};

export const PAYMENT_PROPERTIES: TPaymentProperty[] = [
  { id: "p1", name: "Apartment on Main St", shortName: "Main St" },
  { id: "p2", name: "Mom's apartment", shortName: "Mom's apt" },
  { id: "p3", name: "Summer house", shortName: "Summer house" },
];

export const PAYMENT_SERVICES: TPaymentService[] = [
  { id: "electricity", name: "Electricity", unit: "kWh" },
  { id: "gas", name: "Gas", unit: "m³" },
  { id: "coldWater", name: "Cold water", unit: "m³" },
  { id: "hotWater", name: "Hot water", unit: "m³" },
  { id: "internet", name: "Internet", unit: null },
  { id: "heating", name: "Heating", unit: "m³" },
];

const MONTHS: Array<{ year: number; month: number }> = [
  { year: 2024, month: 4 },
  { year: 2024, month: 5 },
  { year: 2024, month: 6 },
  { year: 2024, month: 7 },
  { year: 2024, month: 8 },
  { year: 2024, month: 9 },
  { year: 2024, month: 10 },
  { year: 2024, month: 11 },
  { year: 2024, month: 12 },
  { year: 2025, month: 1 },
  { year: 2025, month: 2 },
  { year: 2025, month: 3 },
];

const SERVICES_PER_PROPERTY: Record<string, TServiceKey[]> = {
  p1: ["electricity", "gas", "coldWater", "hotWater", "internet", "heating"],
  p2: ["electricity", "gas", "coldWater", "hotWater", "internet", "heating"],
  p3: ["electricity", "gas"],
};

const BASE_AMOUNTS: Record<string, Record<TServiceKey, number>> = {
  p1: { electricity: 680, gas: 300, coldWater: 150, hotWater: 230, internet: 250, heating: 520 },
  p2: { electricity: 440, gas: 220, coldWater: 110, hotWater: 180, internet: 250, heating: 380 },
  p3: { electricity: 320, gas: 180, coldWater: 0, hotWater: 0, internet: 0, heating: 0 },
};

const HEATING_MULT = [0.2, 0.15, 0, 0, 0, 0, 0, 0.18, 0.72, 1.0, 1.1, 1.05];
const GAS_MULT = [1.0, 0.95, 0.7, 0.4, 0.3, 0.3, 0.3, 0.35, 0.55, 0.75, 0.9, 1.0];

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const seasonalMult = (serviceId: TServiceKey, month: number): number => {
  const idx = month - 1;
  if (serviceId === "heating") return HEATING_MULT[idx] ?? 0;
  if (serviceId === "gas") return GAS_MULT[idx] ?? 0;
  return 0.85 + Math.sin(month * 0.5) * 0.15;
};

const getService = (id: TServiceKey): TPaymentService => {
  const s = PAYMENT_SERVICES.find((p) => p.id === id);
  if (!s) throw new Error(`Unknown service: ${id}`);
  return s;
};

const nextMonth = (year: number, month: number): { year: number; month: number } =>
  month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

const generatePayments = (): TPayment[] => {
  const payments: TPayment[] = [];
  let pid = 1;

  for (const { year, month } of MONTHS) {
    for (const prop of PAYMENT_PROPERTIES) {
      const services = SERVICES_PER_PROPERTY[prop.id] ?? [];
      for (const serviceId of services) {
        const seasonal = seasonalMult(serviceId, month);
        if (seasonal < 0.05) continue;

        const base = BASE_AMOUNTS[prop.id]?.[serviceId] ?? 0;
        const noise = 0.93 + Math.abs(Math.sin(pid * 2.1)) * 0.14;
        const raw = Math.round((base * seasonal * noise) / 10) * 10;
        if (raw < 20) continue;

        const payDay = 12 + (pid % 10);
        const pay = nextMonth(year, month);

        payments.push({
          id: pid,
          paidAt: `${payDay} ${MONTH_ABBR[pay.month - 1]} ${pay.year}`,
          sortTs: pay.year * 10000 + pay.month * 100 + payDay,
          property: prop,
          service: getService(serviceId),
          amount: raw,
        });

        pid++;
      }
    }
  }

  payments.sort((a, b) => b.sortTs - a.sortTs);
  return payments;
};

export const ALL_PAYMENTS: TPayment[] = generatePayments();
