"use client";

import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import type { TPropertyOption } from "@/features/properties";

type TPaymentsTableContext = {
  requestDelete: (payment: TPaymentGlobalRow) => void;
  properties: TPropertyOption[];
};

export const [PaymentsTableContext, usePaymentsTable] =
  createSafeContext<TPaymentsTableContext>("PaymentsTable");
