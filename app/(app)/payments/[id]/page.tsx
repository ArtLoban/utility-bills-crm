import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import type { PaymentId } from "@/lib/db/schema/payments";
import { paymentByIdForUser } from "@/lib/db/access/payments";
import { roleAtLeast } from "@/lib/db/access/properties";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { PageContainer } from "@/components/page-container";
import { PaymentDetail, PaymentDetailActions } from "@/features/payments";
import { resolveServiceLabel } from "@/features/services/service-label";
import { ROUTES } from "@/lib/routes";

type TProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "Payment" };

export default async function PaymentDetailPage({ params }: TProps) {
  const userId = await requireUser();
  const { id } = await params;

  const result = await paymentByIdForUser(userId, id as PaymentId);
  if (!result.ok) notFound();

  const payment = result.value;
  const [t, tTypes] = await Promise.all([
    getTranslations("payments"),
    getTranslations("services.types"),
  ]);
  const serviceLabel = resolveServiceLabel(
    { name: payment.serviceName, code: payment.serviceTypeCode },
    tTypes,
  );
  const canMutate = roleAtLeast(payment.role, PROPERTY_ROLES.EDITOR);

  return (
    <PageContainer
      title={t("detail.title")}
      breadcrumbs={[{ label: t("list.title"), href: ROUTES.payments }, { label: serviceLabel }]}
      actions={
        <PaymentDetailActions payment={payment} canMutate={canMutate} serviceLabel={serviceLabel} />
      }
    >
      <PaymentDetail payment={payment} serviceLabel={serviceLabel} />
    </PageContainer>
  );
}
