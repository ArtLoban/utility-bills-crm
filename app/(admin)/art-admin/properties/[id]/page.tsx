import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAdminPropertyDetail } from "@/features/admin-properties";
import { PropertyDetail } from "./_components/property-detail";

type TProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "Property — Admin" };

export default async function AdminPropertyDetailPage({ params }: TProps) {
  const { id } = await params;
  const property = await getAdminPropertyDetail(id);
  if (!property) notFound();

  return <PropertyDetail property={property} />;
}
