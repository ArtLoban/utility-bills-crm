import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/guards";
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
  const userId = await requireUser();
  const params = await loadBillsParams(searchParams);

  const [result, propertiesWithRole] = await Promise.all([
    getBillsList(userId, params),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property: { id, name, type } }) => ({
    id,
    name,
    type,
  }));

  return <BillsClient billsList={result} properties={propertyOptions} />;
}
