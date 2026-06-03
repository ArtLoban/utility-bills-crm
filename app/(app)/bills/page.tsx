import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { getBillsList } from "@/lib/db/access/bills";
import { loadBillsParams } from "@/features/bills/query-params";
import { BillsClient } from "./_components/bills-client";

export const metadata: Metadata = {
  title: "Bills",
  description: "Track and manage utility bills across your properties.",
};

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await auth();
  const userId = session?.user?.id as UserId;

  const params = await loadBillsParams(searchParams);

  const [result, propertiesWithRole] = await Promise.all([
    getBillsList(userId, params),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property }) => ({
    id: property.id,
    name: property.name,
  }));

  return <BillsClient billsList={result} properties={propertyOptions} />;
}
