import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { getPaymentsList, servicesForPaymentForm } from "@/lib/db/access/payments";
import { parsePaymentsParams } from "@/features/payments/query-params";
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

  const raw = await searchParams;
  const params = parsePaymentsParams(raw);

  const [result, serviceOptions, propertiesWithRole] = await Promise.all([
    getPaymentsList(userId, params),
    servicesForPaymentForm(userId),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property }) => ({
    id: property.id,
    name: property.name,
  }));

  return (
    <PaymentsClient
      data={result.data}
      pagination={result.pagination}
      totalAmount={result.totals.amount}
      serviceOptions={serviceOptions}
      propertyOptions={propertyOptions}
    />
  );
}
