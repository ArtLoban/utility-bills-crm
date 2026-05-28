import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { BillFormContent, servicesForBillForm } from "@/features/bills";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

export default async function NewBillPage() {
  const session = await auth();
  const userId = session?.user?.id as UserId;

  const [serviceOptions, propertiesWithRole] = await Promise.all([
    servicesForBillForm(userId),
    accessibleProperties(userId),
  ]);

  const propertyOptions = propertiesWithRole.map(({ property }) => ({
    id: property.id,
    name: property.name,
  }));

  return (
    <PageContainer
      title="Add Bill"
      breadcrumbs={[{ label: "Bills", href: ROUTES.bills }, { label: "Add Bill" }]}
    >
      <div className="max-w-2xl">
        <BillFormContent propertyOptions={propertyOptions} serviceOptions={serviceOptions} />
      </div>
    </PageContainer>
  );
}
