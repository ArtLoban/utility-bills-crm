import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import { BillFormContent } from "@/features/bills";
import { servicesForBillForm } from "@/lib/db/access/bills";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

export default async function NewBillPage() {
  const userId = await requireUser();
  const t = await getTranslations("bills");

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
      title={t("modal.add.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.bills },
        { label: t("modal.add.title") },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("page.new.meta")}</span>}
    >
      <BillFormContent propertyOptions={propertyOptions} serviceOptions={serviceOptions} />
    </PageContainer>
  );
}
