import { FilterX, Inbox } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyStateCard } from "@/components/empty-state-card";
import { EMPTY_STATE_KINDS, TEmptyStateKind } from "@/components/data-table/types";

type TProps = {
  kind?: TEmptyStateKind;
};

export const EmptyState = ({ kind = EMPTY_STATE_KINDS.EMPTY }: TProps) => {
  const t = useTranslations("dataTable.list");

  const content =
    kind === EMPTY_STATE_KINDS.EMPTY
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
