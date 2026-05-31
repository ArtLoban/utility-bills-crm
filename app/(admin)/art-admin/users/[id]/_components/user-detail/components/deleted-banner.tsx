import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";

type TProps = {
  deletedAt: Date;
};

export const DeletedBanner = async ({ deletedAt }: TProps) => {
  const t = await getTranslations("adminUsers.detail.deletedBanner");

  return (
    <div className="border-destructive/20 border-l-destructive bg-destructive/5 flex items-start gap-3.5 rounded-lg border border-l-4 px-5 py-4">
      <Trash2 size={18} strokeWidth={1.75} className="text-destructive mt-0.5 shrink-0" />
      <div>
        <p className="text-destructive text-sm font-semibold">{t("title")}</p>
        <p className="text-muted-foreground mt-0.5 text-sm leading-snug">
          {t("description", { date: format(deletedAt, "MMMM d, yyyy") })}
        </p>
      </div>
    </div>
  );
};
