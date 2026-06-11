import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import type { BillId } from "@/lib/db/schema/bills";
import { BillFormContent } from "@/features/bills";
import { billByIdForUser } from "@/lib/db/access/bills";
import { PageContainer } from "@/components/page-container";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { ROUTES } from "@/lib/routes";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBillPage({ params }: TProps) {
  const { id } = await params;
  const t = await getTranslations("bills");
  const session = await auth();
  const userId = session?.user?.id as UserId;

  const result = await billByIdForUser(userId, id as BillId);
  if (!result.ok) notFound();

  const bill = result.value;

  return (
    <PageContainer
      title={t("modal.edit.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.bills },
        { label: t("page.edit.breadcrumb", { service: getServiceLabel(bill.serviceTypeCode) }) },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("page.edit.meta")}</span>}
    >
      <BillFormContent bill={bill} />
    </PageContainer>
  );
}
