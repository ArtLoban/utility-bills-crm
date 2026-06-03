"use client";

import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import type { TSelectableEntity } from "@/components/select-input/types";

type TPaymentsTableContext = {
  requestDelete: (payment: TPaymentGlobalRow) => void;
  properties: TSelectableEntity[];
};

export const [PaymentsTableContext, usePaymentsTable] =
  createSafeContext<TPaymentsTableContext>("PaymentsTable");
