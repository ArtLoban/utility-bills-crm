import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import { paymentByIdForUser, servicesForPaymentForm } from "@/lib/db/access/payments";
import type { PaymentId } from "@/lib/db/schema/payments";
import { PaymentModal } from "@/features/payments";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedEditPaymentPage({ params }: TProps) {
  const userId = await requireUser();
  const { id } = await params;

  const [paymentResult, serviceOptions, propertiesWithRole] = await Promise.all([
    paymentByIdForUser(userId, id as PaymentId),
    servicesForPaymentForm(userId),
    accessibleProperties(userId),
  ]);

  if (!paymentResult.ok) notFound();

  const propertyOptions = propertiesWithRole.map(({ property }) => ({
    id: property.id,
    name: property.name,
  }));

  return (
    <PaymentModal
      payment={paymentResult.value}
      propertyOptions={propertyOptions}
      serviceOptions={serviceOptions}
    />
  );
}
