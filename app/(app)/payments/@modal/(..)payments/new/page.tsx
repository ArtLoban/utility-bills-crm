import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { servicesForPaymentForm } from "@/lib/db/access/payments";
import { PaymentModal } from "@/features/payments";

export default async function InterceptedNewPaymentPage() {
  const session = await auth();
  if (!session) notFound();

  const userId = session.user?.id as UserId;

  const [serviceOptions, propertiesWithRole] = await Promise.all([
    servicesForPaymentForm(userId),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property }) => ({
    id: property.id,
    name: property.name,
  }));

  return <PaymentModal propertyOptions={propertyOptions} serviceOptions={serviceOptions} />;
}
