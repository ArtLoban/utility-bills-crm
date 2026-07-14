"use client";

import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { AddButton } from "@/components/add-button";
import { PageMeta } from "@/components/page-meta";
import type { TProviderWithUsage } from "@/app/(app)/providers/_data/queries";
import { ProvidersList } from "@/app/(app)/providers/_components/providers-client/components/providers-list";

type TProps = {
  providers: TProviderWithUsage[];
};

export const ProvidersClient = ({ providers }: TProps) => {
  const t = useTranslations("providers");
  const hasProviders = providers.length > 0;
  const inUseCount = providers.filter((p) => p.usageCount > 0).length;

  return (
    <PageContainer
      title={t("list.title")}
      actions={<AddButton href={`${ROUTES.providers}/new`} text={t("list.addButton")} />}
      meta={
        <PageMeta items={[t("list.subtitle", { count: providers.length, inUse: inUseCount })]} />
      }
    >
      {hasProviders ? (
        <ProvidersList providers={providers} />
      ) : (
        <EmptyStateCard icon={Building2} title={t("empty.title")} body={t("empty.body")} />
      )}
    </PageContainer>
  );
};
