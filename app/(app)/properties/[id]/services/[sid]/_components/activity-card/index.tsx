import { List } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";
import { ActivityRow } from "./components/activity-row";
import type { TServiceActivityItem } from "../../_data/queries";

type TProps = { items: TServiceActivityItem[] };

export const ActivityCard = async ({ items }: TProps) => {
  const t = await getTranslations("services.detail.activity");

  return (
    <SectionCard title={t("title")}>
      {items.length === 0 ? (
        <SectionCardEmpty icon={List} caption={t("empty")} />
      ) : (
        items.map((item, i) => (
          <ActivityRow key={item.id} item={item} isLast={i === items.length - 1} />
        ))
      )}
    </SectionCard>
  );
};
