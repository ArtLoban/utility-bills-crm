import { z } from "zod";

export const PAYMENT_LIMITS = {
  notes: 1000,
} as const;

export const paymentSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  paidAt: z.string().min(1, "Date is required"),
  amount: z.number({ error: "Amount must be a number" }).positive("Amount must be greater than 0"),
  notes: z.string().trim().max(PAYMENT_LIMITS.notes).optional().or(z.literal("")),
});

export type TPaymentInput = z.infer<typeof paymentSchema>;
