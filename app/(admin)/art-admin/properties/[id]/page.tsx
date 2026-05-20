import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DETAIL_MOCK } from "./_data/mock";
import { PropertyDetail } from "./_components/property-detail";

type TProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { id } = await params;
  const property = DETAIL_MOCK[id];
  if (!property) return { title: "Not Found — Admin" };

  return { title: `${property.name} — Admin` };
}

export default async function AdminPropertyDetailPage({ params }: TProps) {
  const { id } = await params;
  const property = DETAIL_MOCK[12]; // devnote. late switch to id
  if (!property) notFound();

  return <PropertyDetail property={property} />;
}
