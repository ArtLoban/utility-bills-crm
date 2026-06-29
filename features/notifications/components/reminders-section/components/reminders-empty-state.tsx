import { getTranslations } from "next-intl/server";
import { Bell, Plus, Send } from "lucide-react";

import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";

type TProps = {
  isLinked: boolean;
  newHref: string;
};

export const RemindersEmptyState = async ({ isLinked, newHref }: TProps) => {
  const t = await getTranslations("reminders");
  const Icon = isLinked ? Bell : Send;

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="bg-muted border-border flex size-12 items-center justify-center rounded-xl border">
        <Icon size={20} className="text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-foreground text-sm font-semibold">
          {isLinked ? t("empty.linked.title") : t("empty.unlinked.title")}
        </p>
        <p className="text-muted-foreground max-w-xs text-sm">
          {isLinked ? t("empty.linked.body") : t("empty.unlinked.body")}
        </p>
      </div>

      {isLinked ? (
        <LinkButton href={newHref} icon={Plus} text={t("add")} variant="default" />
      ) : (
        <LinkButton
          href={ROUTES.settings}
          icon={Send}
          text={t("empty.unlinked.cta")}
          variant="default"
        />
      )}
    </div>
  );
};
