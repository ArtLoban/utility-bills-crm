import type { TServerPagination } from "@/lib/types/data-table";
import type { TPayment } from "@/lib/db/schema/payments";
import type { PropertyId, TPropertyRole, TPropertyType } from "@/lib/db/schema/properties";
import type { TServiceTypeCode } from "@/features/services/service-type";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";
import { TDataTableParams } from "@/components/data-table/types";
import { TDateParams } from "@/lib/types/common";

// --- Sort allow-list ---

export const PAYMENT_SORT_COLUMNS = {
  PAID_AT: "paidAt",
  AMOUNT: "amount",
  CREATED_AT: "createdAt",
  PROPERTY: "property",
  SERVICE: "service",
} as const;

export type TPaymentSortColumn = (typeof PAYMENT_SORT_COLUMNS)[keyof typeof PAYMENT_SORT_COLUMNS];

// --- List query contract (Decision #120) ---

export const PAYMENTS_FILTERS = {
  PROPERTY_ID: "propertyId",
  SERVICES: "services",
} as const;

export type TPaymentsListParams = TDataTableParams &
  TDateParams & {
    [PAYMENTS_FILTERS.PROPERTY_ID]?: string | null;
    [PAYMENTS_FILTERS.SERVICES]?: string[] | null; // serviceType codes, ;-separated in URL
  };

// --- Row shape returned from getPaymentsList ---

export type TPaymentGlobalRow = {
  payment: Pick<TPayment, "id" | "serviceId" | "paidAt" | "amount" | "notes" | "createdAt">;
  serviceTypeCode: TServiceTypeCode;
  serviceTypeUnit: TServiceTypeUnit | null;
  property: { id: PropertyId; name: string; type: TPropertyType };
  role: TPropertyRole;
};

// --- List result ---

export type TPaymentsListResult = {
  data: TPaymentGlobalRow[];
  pagination: TServerPagination;
  totals: { amount: string };
};

// --- Form field names ---

export const PaymentFormField = {
  PROPERTY: "property",
  SERVICE_ID: "serviceId",
  PAID_AT: "paidAt",
  AMOUNT: "amount",
  NOTES: "notes",
} as const;

export type TPaymentFormField = (typeof PaymentFormField)[keyof typeof PaymentFormField];
