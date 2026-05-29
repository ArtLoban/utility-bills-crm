import type { TServerPagination } from "@/lib/types/data-table";
import type { TPayment } from "@/lib/db/schema/payments";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceTypeCode } from "@/features/services/service-type";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";
import { TDataTableParams } from "@/components/data-table/data-table/types";
import { TDateParams } from "@/lib/types/common";

// --- Sort allow-list ---

export const PAYMENTS_SORT_COLUMNS = ["paidAt", "amount", "createdAt"] as const;
export type TPaymentSortColumn = (typeof PAYMENTS_SORT_COLUMNS)[number];

// --- List query contract (Decision #120) ---

export type TPaymentsListParams = TDataTableParams &
  TDateParams & {
    propertyId?: string;
    services?: string[]; // serviceType codes, ;-separated in URL
  };

// --- Row shape returned from getPaymentsList ---

export type TPaymentGlobalRow = {
  payment: Pick<TPayment, "id" | "serviceId" | "paidAt" | "amount" | "notes" | "createdAt">;
  serviceTypeCode: TServiceTypeCode;
  serviceTypeUnit: TServiceTypeUnit | null;
  property: { id: PropertyId; name: string };
  role: TPropertyRole;
};

// --- List result ---

export type TPaymentsListResult = {
  data: TPaymentGlobalRow[];
  pagination: TServerPagination;
  // SUM of all filtered payments (not just current page) — for "Total paid (filtered)" footer.
  totalAmount: string;
};

// --- Form types ---

export type TPaymentFormValues = {
  serviceId: string;
  paidAt: string;
  amount: number;
  notes?: string;
};
