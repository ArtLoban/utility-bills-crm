import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Bell, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

type TProps = {
  isLinked: boolean;
  newHref: string;
};

export const RemindersEmptyState = async ({ isLinked, newHref }: TProps) => {
  const t = await getTranslations("reminders");

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <Bell size={28} className="text-muted-foreground/50" />
      <div className="flex flex-col gap-1">
        <p className="text-foreground text-sm font-medium">
          {isLinked ? t("empty.linked.title") : t("empty.unlinked.title")}
        </p>
        <p className="text-muted-foreground max-w-xs text-sm">
          {isLinked ? t("empty.linked.body") : t("empty.unlinked.body")}
        </p>
      </div>

      {isLinked ? (
        <Button asChild size="sm">
          <Link href={newHref}>
            <Plus size={14} />
            {t("add")}
          </Link>
        </Button>
      ) : (
        <Button asChild size="sm" variant="outline">
          <Link href={ROUTES.settings}>{t("empty.unlinked.cta")}</Link>
        </Button>
      )}
    </div>
  );
};
