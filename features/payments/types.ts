import type { z } from "zod";
import type { paymentSchema } from "./schema";

export type TPaymentFormValues = z.infer<typeof paymentSchema>;

export type TPropertyOption = {
  id: string;
  name: string;
};

export type TServiceOption = {
  id: string;
  name: string;
  propertyId: string;
};

export type TPaymentRecord = {
  id: string;
  serviceId: string;
  paidAt: string;
  amount: number;
  notes?: string;
};
