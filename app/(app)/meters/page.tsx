import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import { metersForGlobalList } from "@/lib/db/access/meters";
import { accessibleProperties } from "@/lib/db/access/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { MetersClient } from "./_components/meters-client";

export const metadata: Metadata = {
  title: "Meters",
  description: "Monitor meter readings and consumption across your properties.",
};

export default async function MetersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <MetersClient meters={[]} properties={[]} />;
  }

  const userId = session.user.id as UserId;
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
