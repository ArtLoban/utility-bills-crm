import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { servicesForPaymentForm } from "@/lib/db/access/payments";
import { PaymentFormContent } from "@/features/payments";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

export default async function NewPaymentPage() {
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

  return (
    <PageContainer
      title="Record Payment"
      breadcrumbs={[{ label: "Payments", href: ROUTES.payments }, { label: "Record Payment" }]}
      meta={<span className="text-sm text-zinc-500">Create new Payment</span>}
    >
      <PaymentFormContent propertyOptions={propertyOptions} serviceOptions={serviceOptions} />
    </PageContainer>
  );
}
