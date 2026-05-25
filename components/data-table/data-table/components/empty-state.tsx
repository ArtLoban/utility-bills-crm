import { FilterX, Inbox } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyStateCard } from "@/components/empty-state-card";

type TProps = {
  kind?: "empty" | "noResults";
};

export const EmptyState = ({ kind = "empty" }: TProps) => {
  const t = useTranslations("dataTable.list");

  const content =
    kind === "empty"
      ? {
          title: t("empty.title"),
          icon: Inbox,
          body: t("empty.body"),
        }
      : {
          title: t("noResults.title"),
          icon: FilterX,
        };

  return <EmptyStateCard {...content} />;
};
