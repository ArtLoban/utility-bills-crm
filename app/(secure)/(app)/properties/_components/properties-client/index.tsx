import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

import { AddButton } from "@/components/add-button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { ROUTES } from "@/lib/routes";
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

  const addButton = <AddButton href={`${ROUTES.properties}/new`} text={t("list.addButton")} />;

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
