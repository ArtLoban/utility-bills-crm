import { getTranslations } from "next-intl/server";

import { ProviderFormContent } from "@/features/providers";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

export default async function NewProviderPage() {
  const t = await getTranslations("providers");

  return (
    <PageContainer
      title={t("modal.add.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.providers },
        { label: t("modal.add.title") },
      ]}
    >
      <div className="max-w-2xl">
        <ProviderFormContent />
      </div>
    </PageContainer>
  );
}
