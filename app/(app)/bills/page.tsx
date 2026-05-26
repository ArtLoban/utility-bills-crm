import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { billsForGlobalList, servicesForBillForm } from "@/lib/db/access/bills";
import { BillsClient } from "./_components/bills-client";

export const metadata: Metadata = {
  title: "Bills",
  description: "Track and manage utility bills across your properties.",
};

export default async function BillsPage() {
  const session = await auth();
  const userId = session?.user?.id as UserId;

  const [bills, serviceOptions] = await Promise.all([
    billsForGlobalList(userId),
    servicesForBillForm(userId),
  ]);

  return <BillsClient initialBills={bills} serviceOptions={serviceOptions} />;
}
