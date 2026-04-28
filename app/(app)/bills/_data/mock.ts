import { TServiceKey } from "@/lib/constants/service-colors";

export type TBillProperty = {
  id: string;
  name: string;
  shortName: string;
};

export type TBillService = {
  id: TServiceKey;
  name: string;
  unit: string | null;
};

export type TBill = {
  id: number;
  date: string;
  sortTs: number;
  property: TBillProperty;
  service: TBillService;
  period: string;
  periodSort: number;
  amount: number;
};

export type TSortColumn = "date" | "property" | "service" | "period" | "amount";
export type TSortDir = "asc" | "desc";

export type TFilterState = {
  property: string;
  service: string;
  period: string;
};

export const BILL_PROPERTIES: TBillProperty[] = [
  { id: "p1", name: "Apartment on Main St", shortName: "Main St" },
  { id: "p2", name: "Mom's apartment", shortName: "Mom's apt" },
  { id: "p3", name: "Summer house", shortName: "Summer house" },
];

export const BILL_SERVICES: TBillService[] = [
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

// Jan–Dec, index 0 = January
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

const getService = (id: TServiceKey): TBillService => {
  const s = BILL_SERVICES.find((b) => b.id === id);
  if (!s) throw new Error(`Unknown service: ${id}`);
  return s;
};

const nextMonth = (year: number, month: number): { year: number; month: number } =>
  month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

const generateBills = (): TBill[] => {
  const bills: TBill[] = [];
  let billId = 1;

  for (const { year, month } of MONTHS) {
    for (const prop of BILL_PROPERTIES) {
      const services = SERVICES_PER_PROPERTY[prop.id] ?? [];
      for (const serviceId of services) {
        const seasonal = seasonalMult(serviceId, month);
        if (seasonal < 0.05) continue;

        const base = BASE_AMOUNTS[prop.id]?.[serviceId] ?? 0;
        const noise = 0.92 + Math.abs(Math.sin(billId * 1.7)) * 0.16;
        const amount = Math.round((base * seasonal * noise) / 10) * 10;
        if (amount < 20) continue;

        const payDay = 10 + (billId % 8);
        const pay = nextMonth(year, month);

        bills.push({
          id: billId,
          date: `${payDay} ${MONTH_ABBR[pay.month - 1]} ${pay.year}`,
          sortTs: pay.year * 10000 + pay.month * 100 + payDay,
          property: prop,
          service: getService(serviceId),
          period: `${MONTH_ABBR[month - 1]} ${year}`,
          periodSort: year * 100 + month,
          amount,
        });

        billId++;
      }
    }
  }

  bills.sort((a, b) => b.sortTs - a.sortTs);
  return bills;
};

export const ALL_BILLS: TBill[] = generateBills();
