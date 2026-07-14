import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import { paymentByIdForUser, servicesForPaymentForm } from "@/lib/db/access/payments";
import type { PaymentId } from "@/lib/db/schema/payments";
import { PaymentFormContent } from "@/features/payments";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPaymentPage({ params }: TProps) {
  const userId = await requireUser();
  const { id } = await params;
  const t = await getTranslations("payments");

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
    <PageContainer
      title={t("modal.edit.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.payments },
        { label: t("modal.edit.title") },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("page.edit.meta")}</span>}
    >
      <PaymentFormContent
        payment={paymentResult.value}
        propertyOptions={propertyOptions}
        serviceOptions={serviceOptions}
      />
    </PageContainer>
  );
}
