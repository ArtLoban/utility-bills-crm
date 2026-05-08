import type { Metadata } from "next";

import { BillsClient } from "./_components/bills-client";

export const metadata: Metadata = { title: "Bills" };

export default function BillsPage() {
  return <BillsClient />;
}
