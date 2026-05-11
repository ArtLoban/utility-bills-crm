import type { Metadata } from "next";

import { PaymentsClientNew } from "./_components/payments-client";

export const metadata: Metadata = {
  title: "Payments (new)",
  description: "Refactored payments page — TanStack Table + nuqs",
};

export default function PaymentsNewPage() {
  return <PaymentsClientNew />;
}
