import type { Metadata } from "next";

import { getProviderList } from "./_data/queries";
import { ProvidersClient } from "./_components/providers-client";

export const metadata: Metadata = {
  title: "Providers",
  description: "Manage your utility service providers.",
};

export default async function ProvidersPage() {
  const providers = await getProviderList();
  return <ProvidersClient providers={providers} />;
}
