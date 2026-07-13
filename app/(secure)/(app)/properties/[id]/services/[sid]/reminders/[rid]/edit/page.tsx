import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { PageContainer } from "@/components/page-container";
import { ReminderFormContent } from "@/features/notifications";
import { resolveServiceLabelServer } from "@/features/services/service-label.server";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

import { getRemindersForService, getServiceDetail } from "../../../_data/queries";

type TProps = {
  params: Promise<{ id: string; sid: string; rid: string }>;
};

export default async function EditReminderPage({ params }: TProps) {
  const { id, sid, rid } = await params;

  const [propertyResult, serviceResult] = await Promise.all([
    getPropertyDetail(id as PropertyId),
    getServiceDetail(sid as TServiceId),
  ]);

  if (!propertyResult.ok) notFound();
  if (!serviceResult.ok || serviceResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const reminder = (await getRemindersForService(sid as TServiceId)).find(
    (item) => item.id === rid,
  );
  if (!reminder) notFound();

  const property = propertyResult.value;
  const { service, serviceType } = serviceResult.value;
  const t = await getTranslations("reminders");
  const tProperties = await getTranslations("properties");
  const serviceName = await resolveServiceLabelServer(service, serviceType);

  return (
    <PageContainer
      title={t("modal.edit.title")}
      breadcrumbs={[
        { label: tProperties("list.title"), href: ROUTES.properties },
        { label: property.name, href: `${ROUTES.properties}/${id}` },
        {
          label: serviceName,
          href: `${ROUTES.properties}/${id}/services/${sid}`,
        },
        { label: t("modal.edit.title") },
      ]}
    >
      <div className="max-w-2xl">
        <ReminderFormContent serviceId={sid as TServiceId} reminder={reminder} />
      </div>
    </PageContainer>
  );
}
