import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import { BillModal } from "@/features/bills";
import { servicesForBillForm } from "@/lib/db/access/bills";

export default async function InterceptedNewBillPage() {
  const userId = await requireUser();

  const [serviceOptions, propertiesWithRole] = await Promise.all([
    servicesForBillForm(userId),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property }) => ({
    id: property.id,
    name: property.name,
  }));

  return <BillModal propertyOptions={propertyOptions} serviceOptions={serviceOptions} />;
}
