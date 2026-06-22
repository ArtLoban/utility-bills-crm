import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/guards";
import { getMetersList } from "@/lib/db/access/meters";
import { accessibleProperties } from "@/lib/db/access/properties";
import { loadMetersParams } from "@/features/meters/query-params";
import { MetersClient } from "./_components/meters-client";

export const metadata: Metadata = {
  title: "Meters",
  description: "Monitor meter readings and consumption across your properties.",
};

export default async function MetersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const userId = await requireUser();
  const params = await loadMetersParams(searchParams);

  const [metersList, propertiesWithRole] = await Promise.all([
    getMetersList(userId, params),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property: { id, name, type } }) => ({
    id,
    name,
    type,
  }));

  return <MetersClient metersList={metersList} properties={propertyOptions} />;
}
