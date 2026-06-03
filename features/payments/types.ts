import type { TServerPagination } from "@/lib/types/data-table";
import type { TPayment } from "@/lib/db/schema/payments";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceTypeCode } from "@/features/services/service-type";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";
import { TDataTableParams } from "@/components/data-table/types";
import { TDateParams } from "@/lib/types/common";

// --- Sort allow-list ---

export const PAYMENT_SORT_COLUMNS = {
  PAID_AT: "paidAt",
  AMOUNT: "amount",
  CREATED_AT: "createdAt",
} as const;

export type TPaymentSortColumn = (typeof PAYMENT_SORT_COLUMNS)[keyof typeof PAYMENT_SORT_COLUMNS];

// --- List query contract (Decision #120) ---

export type TPaymentsListParams = TDataTableParams &
  TDateParams & {
    propertyId?: string | null;
    services?: string[] | null; // serviceType codes, ;-separated in URL
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
  totals: { amount: string };
};

// --- Form types ---

export type TPaymentFormValues = {
  serviceId: string;
  paidAt: string;
  amount: number;
  notes?: string;
};
