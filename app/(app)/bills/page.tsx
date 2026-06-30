import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import { getBillsList } from "@/lib/db/access/bills";
import { loadBillsParams } from "@/features/bills/query-params";
import { BillsClient } from "./_components/bills-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("bills");
  return {
    title: t("list.title"),
    description: t("list.metaDescription"),
  };
}

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
