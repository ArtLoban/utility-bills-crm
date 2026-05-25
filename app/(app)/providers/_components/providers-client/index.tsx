"use client";

import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { ProviderRow } from "./components/provider-row";
import type { TProvider } from "@/lib/db/schema/providers";

type TProps = {
  providers: TProvider[];
};

export const ProvidersClient = ({ providers }: TProps) => {
  const t = useTranslations("providers");
  const hasProviders = providers.length > 0;

  const addButton = (
    <Button asChild>
      <Link href={`${ROUTES.providers}/new`}>
        <Plus size={16} />
        {t("list.addButton")}
      </Link>
    </Button>
  );

  return (
    <PageContainer title={t("list.title")} actions={hasProviders && addButton}>
      {hasProviders ? (
        <div className="flex flex-col gap-2">
          {providers.map((provider) => (
            <ProviderRow key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <EmptyStateCard
          icon={<Building2 size={32} className="text-zinc-500" />}
          title={t("empty.title")}
          body={t("empty.body")}
          cta={addButton}
        />
      )}
    </PageContainer>
  );
};
