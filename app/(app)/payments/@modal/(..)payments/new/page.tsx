import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import { servicesForPaymentForm } from "@/lib/db/access/payments";
import { PaymentModal } from "@/features/payments";

export default async function InterceptedNewPaymentPage() {
  const userId = await requireUser();
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
