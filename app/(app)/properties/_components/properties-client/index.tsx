import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { Properties } from "./components/properties";
import type { TPropertyListItem } from "../../_data/queries";

type TProps = {
  properties: TPropertyListItem[];
};

export const PropertiesClient = ({ properties }: TProps) => {
  const t = useTranslations("properties");
  const hasProperties = properties.length > 0;

  const ownedCount = properties.filter((property) => property.role === PROPERTY_ROLES.OWNER).length;
  const sharedCount = properties.length - ownedCount;

  const meta = [
    ownedCount > 0 ? t("list.meta.owned", { count: ownedCount }) : null,
    sharedCount > 0 ? t("list.meta.shared", { count: sharedCount }) : null,
  ];

  const addButton = (
    <Button asChild>
      <Link href="/properties/new">
        <Plus size={16} />
        {t("list.addButton")}
      </Link>
    </Button>
  );

  return (
    <PageContainer
      title={t("list.title")}
      actions={hasProperties && addButton}
      meta={hasProperties && <PageMeta items={meta} />}
    >
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
