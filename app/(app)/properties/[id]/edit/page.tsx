import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { PropertyFormContent } from "@/features/properties";
import { PageContainer } from "@/components/page-container";
import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { ROUTES } from "@/lib/routes";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({ params }: TProps) {
  const { id } = await params;
  const result = await getPropertyDetail(id as PropertyId);
  if (!result.ok) notFound();

  const property = result.value;
  const t = await getTranslations("properties");

  return (
    <PageContainer
      title={t("modal.edit.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.properties },
        { label: property.name, href: `${ROUTES.properties}/${id}` },
        { label: t("modal.edit.title") },
      ]}
    >
      <PropertyFormContent property={property} />
    </PageContainer>
  );
}
