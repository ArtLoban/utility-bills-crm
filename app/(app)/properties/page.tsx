import type { Metadata } from "next";

import { PropertiesClient } from "./_components/properties-client";

export const metadata: Metadata = {
  title: "Properties",
  description: "Manage your properties and associated utility services.",
};

export default function PropertiesPage() {
  return <PropertiesClient />;
}
