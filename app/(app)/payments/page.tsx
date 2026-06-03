import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { getPaymentsList } from "@/lib/db/access/payments";
import { loadPaymentsParams } from "@/features/payments/query-params";
import { PaymentsClient } from "./_components/payments-client";

export const metadata: Metadata = {
  title: "Payments",
  description: "View and record payments for your utility bills.",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await auth();
  const userId = session?.user?.id as UserId;

  const params = await loadPaymentsParams(searchParams);

  const [result, propertiesWithRole] = await Promise.all([
    getPaymentsList(userId, params),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property }) => ({
    id: property.id,
    name: property.name,
  }));

  return <PaymentsClient paymentsList={result} properties={propertyOptions} />;
}
