import type { Metadata } from "next";

import { getPropertyList } from "./_data/queries";
import { PropertiesClient } from "./_components/properties-client";

export const metadata: Metadata = {
  title: "Properties",
  description: "Manage your properties and associated utility services.",
};

export default async function PropertiesPage() {
  const properties = await getPropertyList();

  return <PropertiesClient properties={properties} />;
}
