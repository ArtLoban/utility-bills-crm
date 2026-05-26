import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ROUTES } from "@/lib/routes";
import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import type { PropertyId } from "@/lib/db/schema/properties";
import { getAvailableServiceTypesForMeter, getPropertyMeters } from "./_data/queries";
import { MetersClient } from "./_components/meters-client";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function MetersPage({ params }: TProps) {
  const { id } = await params;
  const propertyId = id as PropertyId;

  const [propertyResult, metersResult, availableServiceTypes] = await Promise.all([
    getPropertyDetail(propertyId),
    getPropertyMeters(propertyId),
    getAvailableServiceTypesForMeter(propertyId),
  ]);

  if (!propertyResult.ok || !metersResult.ok) notFound();

  const property = propertyResult.value;

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 32px 80px", width: "100%" }}>
      <Breadcrumbs
        items={[
          { label: "Properties", href: ROUTES.properties },
          { label: property.name, href: `${ROUTES.properties}/${id}` },
          { label: "Meters" },
        ]}
      />
      <MetersClient
        propertyId={id}
        meters={metersResult.value}
        availableServiceTypes={availableServiceTypes}
        role={property.role}
      />
    </div>
  );
}
