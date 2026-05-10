import { Metadata } from "next";

import { PropertiesClient } from "./_components/properties-client";

export const metadata: Metadata = { title: "Properties — Admin" };

export default function AdminPropertiesPage() {
  return <PropertiesClient />;
}
