import { List } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";

export const ActivityCard = async () => {
  const t = await getTranslations("services.detail.activity");

  return (
    <SectionCard title={t("title")}>
      <SectionCardEmpty icon={List} caption={t("empty")} />
    </SectionCard>
  );
};
