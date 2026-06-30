import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import { getPaymentsList } from "@/lib/db/access/payments";
import { loadPaymentsParams } from "@/features/payments/query-params";
import { PaymentsClient } from "./_components/payments-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("payments");
  return {
    title: t("list.title"),
    description: t("list.metaDescription"),
  };
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const userId = await requireUser();
  const params = await loadPaymentsParams(searchParams);

  const [result, propertiesWithRole] = await Promise.all([
    getPaymentsList(userId, params),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property: { id, name, type } }) => ({
    id,
    name,
    type,
  }));

  return <PaymentsClient paymentsList={result} properties={propertyOptions} />;
}
