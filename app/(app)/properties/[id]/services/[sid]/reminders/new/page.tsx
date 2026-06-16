import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { PageContainer } from "@/components/page-container";
import { ReminderFormContent } from "@/features/notifications";
import { ROUTES } from "@/lib/routes";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

import { getServiceDetail } from "../../_data/queries";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function NewReminderPage({ params }: TProps) {
  const { id, sid } = await params;

  const [propertyResult, serviceResult] = await Promise.all([
    getPropertyDetail(id as PropertyId),
    getServiceDetail(sid as TServiceId),
  ]);

  if (!propertyResult.ok) notFound();
  if (!serviceResult.ok || serviceResult.value.role === "viewer") notFound();

  const property = propertyResult.value;
  const { serviceType } = serviceResult.value;
  const t = await getTranslations("reminders");
  const tProperties = await getTranslations("properties");
  const tServiceTypes = await getTranslations("services.types");

  return (
    <PageContainer
      title={t("modal.add.title")}
      breadcrumbs={[
        { label: tProperties("list.title"), href: ROUTES.properties },
        { label: property.name, href: `${ROUTES.properties}/${id}` },
        {
          label: tServiceTypes(serviceType.code as Parameters<typeof tServiceTypes>[0]),
          href: `${ROUTES.properties}/${id}/services/${sid}`,
        },
        { label: t("modal.add.title") },
      ]}
    >
      <div className="max-w-2xl">
        <ReminderFormContent serviceId={sid as TServiceId} />
      </div>
    </PageContainer>
  );
}
