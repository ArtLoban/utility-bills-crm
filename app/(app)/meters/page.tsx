import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/guards";
import { metersForGlobalList } from "@/lib/db/access/meters";
import { accessibleProperties } from "@/lib/db/access/properties";
import { MetersClient } from "./_components/meters-client";

export const metadata: Metadata = {
  title: "Meters",
  description: "Monitor meter readings and consumption across your properties.",
};

export default async function MetersPage() {
  const userId = await requireUser();
  const [meters, propertyAccesses] = await Promise.all([
    metersForGlobalList(userId),
    accessibleProperties(userId),
  ]);

  // Deduplicated property list for the filter bar.
  const properties = propertyAccesses.map((pa) => ({
    id: pa.property.id,
    name: pa.property.name,
  }));

  return <MetersClient meters={meters} properties={properties} />;
}
