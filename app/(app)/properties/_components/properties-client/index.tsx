"use client";

import { useState } from "react";
import { Home, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PropertyModal } from "@/components/feature/properties/property-modal";
import { PageContainer } from "@/components/page-container";
import { Properties } from "./components/properties";
import type { TPropertyListItem } from "../../_data/queries";

type TProps = {
  properties: TPropertyListItem[];
};

export const PropertiesClient = ({ properties }: TProps) => {
  const t = useTranslations("properties");
  const [modalOpen, setModalOpen] = useState(false);
  const hasProperties = properties.length > 0;

  const addButton = (
    <Button onClick={() => setModalOpen(true)}>
      <Plus size={16} />
      {t("list.addButton")}
    </Button>
  );

  return (
    <PageContainer title={t("list.title")} actions={hasProperties && addButton}>
      {hasProperties ? (
        <Properties properties={properties} />
      ) : (
        <EmptyStateCard
          icon={<Home size={40} className="text-zinc-500" />}
          title={t("empty.title")}
          body={t("empty.body")}
          cta={addButton}
        />
      )}
      <PropertyModal open={modalOpen} onOpenChange={setModalOpen} />
    </PageContainer>
  );
};
