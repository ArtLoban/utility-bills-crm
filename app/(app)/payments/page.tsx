import type { Metadata } from "next";

import { PaymentsClient } from "./_components/payments-client";
import { ALL_PAYMENTS } from "@/app/(app)/payments/_data/mock";

export const metadata: Metadata = {
  title: "Payments",
  description: "View and record payments for your utility bills.",
};

export default function PaymentsPage() {
  const data = [...ALL_PAYMENTS];

  return <PaymentsClient payments={data} />;
}
