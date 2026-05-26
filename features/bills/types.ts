import type { BillId } from "@/lib/db/schema/bills";
import type { TServiceId } from "@/lib/db/schema/services";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";

// Display-formatted shape consumed by all bills UI components.
// Produced by useBillsList from TBillGlobalRow.
export type TBillRow = {
  id: BillId;
  serviceId: TServiceId;
  date: string; // formatted createdAt, e.g. "10 May 2026"
  sortTs: number; // createdAt timestamp for sort-by-date
  property: { id: PropertyId; name: string };
  service: { id: string; name: string; unit: TServiceTypeUnit | null };
  period: string; // e.g. "May 2024"
  periodSort: number; // YYYYMM, e.g. 202405
  amount: number; // parsed from numeric string
  notes: string | null;
};

export type TSortColumn = "date" | "property" | "service" | "period" | "amount";
export type TSortDir = "asc" | "desc";

export type TFilterState = {
  property: string;
  service: string;
  period: string;
};
