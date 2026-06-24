import { format } from "date-fns";
import { type DefaultValues } from "react-hook-form";

import { ISO_DATE_FORMAT } from "@/lib/format/date";
import { type TPaymentFormValues } from "@/features/payments/schema";
import { type TPaymentGlobalRow } from "@/features/payments/types";

export const buildDefaultValues = (
  payment?: TPaymentGlobalRow,
): DefaultValues<TPaymentFormValues> => {
  if (!payment) {
    return {
      property: "",
      serviceId: "",
      paidAt: format(new Date(), ISO_DATE_FORMAT),
      amount: "",
      notes: "",
    };
  }

  return {
    property: payment.property.id,
    serviceId: payment.payment.serviceId,
    paidAt: payment.payment.paidAt,
    amount: payment.payment.amount,
    notes: payment.payment.notes ?? "",
  };
};
