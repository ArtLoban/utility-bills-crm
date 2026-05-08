import type { Metadata } from "next";

import { PaymentsClient } from "./_components/payments-client";

export const metadata: Metadata = {
  title: "Payments",
  description: "View and record payments for your utility bills.",
};

const PaymentsPage = () => (
  <div className="flex-1 bg-zinc-100 md:bg-white dark:bg-zinc-950 md:dark:bg-zinc-950">
    <PaymentsClient />
  </div>
);

export default PaymentsPage;
