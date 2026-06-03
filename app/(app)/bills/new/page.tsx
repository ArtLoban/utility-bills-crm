import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { BillFormContent } from "@/features/bills";
import { servicesForBillForm } from "@/lib/db/access/bills";
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
      meta={<span className="text-sm text-zinc-500">Create new Bill</span>}
    >
      <BillFormContent propertyOptions={propertyOptions} serviceOptions={serviceOptions} />
    </PageContainer>
  );
}
