import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { getBillsList, servicesForBillForm } from "@/lib/db/access/bills";
import { parseBillsParams } from "@/features/bills/query-params";
import { BillsClient } from "./_components/bills-client";

export const metadata: Metadata = {
  title: "Bills",
  description: "Track and manage utility bills across your properties.",
};

const PERIOD_MONTHS: Record<string, number> = {
  last3: 3,
  last6: 6,
  last12: 12,
};

// Converts a period preset key to concrete dateFrom / dateTo values (YYYY-MM-DD).
// The backend never sees the preset string — only resolved dates.
const resolvePeriodPreset = (raw: Record<string, string>): Record<string, string> => {
  const { period, ...rest } = raw;
  const months = PERIOD_MONTHS[period ?? "last12"] ?? 12;

  const now = new Date();
  const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of current month
  const fromDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1); // first day N months ago

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return { ...rest, dateFrom: fmt(fromDate), dateTo: fmt(toDate) };
};

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await auth();
  const userId = session?.user?.id as UserId;

  const raw = await searchParams;
  const withDates = resolvePeriodPreset(raw);
  const params = parseBillsParams(withDates);

  const [result, serviceOptions, propertiesWithRole] = await Promise.all([
    getBillsList(userId, params),
    servicesForBillForm(userId),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property }) => ({
    id: property.id,
    name: property.name,
  }));

  return (
    <BillsClient
      data={result.data}
      pagination={result.pagination}
      serviceOptions={serviceOptions}
      propertyOptions={propertyOptions}
    />
  );
}
