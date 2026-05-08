import type { Metadata } from "next";

import { BillsClient } from "./_components/bills-client";

export const metadata: Metadata = {
  title: "Bills",
  description: "Track and manage utility bills across your properties.",
};

export default function BillsPage() {
  return <BillsClient />;
}
