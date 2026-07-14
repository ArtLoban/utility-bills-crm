import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import type { BillId } from "@/lib/db/schema/bills";
import { BillFormContent } from "@/features/bills";
import { billByIdForUser } from "@/lib/db/access/bills";
import { PageContainer } from "@/components/page-container";
import { resolveServiceTypeLabel } from "@/features/services/service-label";
import { ROUTES } from "@/lib/routes";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBillPage({ params }: TProps) {
  const userId = await requireUser();
  const { id } = await params;
  const [t, tServiceTypes] = await Promise.all([
    getTranslations("bills"),
    getTranslations("services.types"),
  ]);

  const result = await billByIdForUser(userId, id as BillId);
  if (!result.ok) notFound();

  const bill = result.value;

  return (
    <PageContainer
      title={t("modal.edit.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.bills },
        {
          label: t("page.edit.breadcrumb", {
            service: resolveServiceTypeLabel(bill.serviceTypeCode, tServiceTypes),
          }),
        },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("page.edit.meta")}</span>}
    >
      <BillFormContent bill={bill} />
    </PageContainer>
  );
}
