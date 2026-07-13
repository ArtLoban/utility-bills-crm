import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import type { BillId } from "@/lib/db/schema/bills";
import { billByIdForUser } from "@/lib/db/access/bills";
import { roleAtLeast } from "@/lib/db/access/properties";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { Receipt } from "lucide-react";

import { PageContainer } from "@/components/page-container";
import { IconBadge } from "@/components/icon-badge";
import { BillDetail, BillDetailActions } from "@/features/bills";
import { resolveServiceLabel } from "@/features/services/service-label";
import { ROUTES } from "@/lib/routes";

type TProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "Bill" };

export default async function BillDetailPage({ params }: TProps) {
  const userId = await requireUser();
  const { id } = await params;

  const result = await billByIdForUser(userId, id as BillId);
  if (!result.ok) notFound();

  const bill = result.value;
  const [t, tTypes] = await Promise.all([
    getTranslations("bills"),
    getTranslations("services.types"),
  ]);
  const serviceLabel = resolveServiceLabel(
    { name: bill.serviceName, code: bill.serviceTypeCode },
    tTypes,
  );
  const canMutate = roleAtLeast(bill.role, PROPERTY_ROLES.EDITOR);

  return (
    <PageContainer
      title={t("detail.title")}
      breadcrumbs={[{ label: t("list.title"), href: ROUTES.bills }, { label: serviceLabel }]}
      leading={<IconBadge icon={Receipt} color="var(--destructive)" size="md" border />}
      actions={<BillDetailActions bill={bill} canMutate={canMutate} serviceLabel={serviceLabel} />}
    >
      <BillDetail bill={bill} serviceLabel={serviceLabel} />
    </PageContainer>
  );
}
