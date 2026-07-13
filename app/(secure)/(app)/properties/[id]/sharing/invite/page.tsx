import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { InviteFormContent } from "@/features/sharing";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InvitePage({ params }: TProps) {
  const { id } = await params;
  const propertyId = id as PropertyId;

  const [propertyResult, t, tNav] = await Promise.all([
    getPropertyDetail(propertyId),
    getTranslations("sharing.inviteModal"),
    getTranslations("nav"),
  ]);

  if (!propertyResult.ok) notFound();
  if (propertyResult.value.role !== PROPERTY_ROLES.OWNER) notFound();

  const title = t("title");

  return (
    <PageContainer
      title={title}
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: propertyResult.value.name, href: `${ROUTES.properties}/${id}?tab=sharing` },
        { label: title },
      ]}
    >
      <InviteFormContent propertyId={id} />
    </PageContainer>
  );
}
