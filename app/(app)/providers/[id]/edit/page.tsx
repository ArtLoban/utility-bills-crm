import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ProviderFormContent } from "@/features/providers";
import { PageContainer } from "@/components/page-container";
import { getProviderForEdit } from "@/app/(app)/providers/[id]/_data/queries";
import { ROUTES } from "@/lib/routes";
import type { ProviderId } from "@/lib/db/schema/providers";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProviderPage({ params }: TProps) {
  const { id } = await params;
  const result = await getProviderForEdit(id as ProviderId);
  if (!result.ok) notFound();

  const provider = result.value;
  const t = await getTranslations("providers");

  return (
    <PageContainer
      title={t("modal.edit.title")}
      breadcrumbs={[
        { label: t("list.title"), href: ROUTES.providers },
        { label: t("modal.edit.title") },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("page.edit.meta")}</span>}
    >
      <ProviderFormContent provider={provider} />
    </PageContainer>
  );
}
