import { getTranslations } from "next-intl/server";

import { PropertyFormContent } from "@/features/properties";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

export default async function NewPropertyPage() {
  const t = await getTranslations("properties");

  return (
    <PageContainer
      title={t("modal.add.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.properties },
        { label: t("modal.add.title") },
      ]}
    >
      <PropertyFormContent />
    </PageContainer>
  );
}
