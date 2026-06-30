import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import { servicesForPaymentForm } from "@/lib/db/access/payments";
import { PaymentFormContent } from "@/features/payments";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

export default async function NewPaymentPage() {
  const userId = await requireUser();
  const t = await getTranslations("payments");

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
      title={t("modal.add.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.payments },
        { label: t("modal.add.title") },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("page.new.meta")}</span>}
    >
      <PaymentFormContent propertyOptions={propertyOptions} serviceOptions={serviceOptions} />
    </PageContainer>
  );
}
