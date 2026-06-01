import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { Properties } from "./components/properties";
import type { TPropertyListItem } from "../../_data/queries";

type TProps = {
  properties: TPropertyListItem[];
};

export const PropertiesClient = ({ properties }: TProps) => {
  const t = useTranslations("properties");
  const hasProperties = properties.length > 0;

  const addButton = (
    <Button asChild>
      <Link href="/properties/new">
        <Plus size={16} />
        {t("list.addButton")}
      </Link>
    </Button>
  );

  return (
    <PageContainer title={t("list.title")} actions={hasProperties && addButton}>
      {hasProperties ? (
        <Properties properties={properties} />
      ) : (
        <EmptyStateCard
          icon={Home}
          title={t("empty.title")}
          body={t("empty.body")}
          cta={addButton}
        />
      )}
    </PageContainer>
  );
};
