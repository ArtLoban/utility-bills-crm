import type { Metadata } from "next";

import { PaymentsClient } from "./_components/payments-client";

export const metadata: Metadata = {
  title: "Payments",
  description: "View and record payments for your utility bills.",
};

export default function PaymentsPage() {
  return <PaymentsClient />;
}
