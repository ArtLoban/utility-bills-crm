import { getTranslations } from "next-intl/server";

import { SectionCard } from "@/components/section-card";

type TProps = {
  notes: string | null;
};

export const NotesCard = async ({ notes }: TProps) => {
  const t = await getTranslations("common.notes");

  return (
    <SectionCard title={t("title")} className="h-full">
      <div className="px-5 pb-5">
        {notes ? (
          <p className="text-foreground mt-4 text-sm leading-relaxed whitespace-pre-wrap">
            {notes}
          </p>
        ) : (
          <p className="text-muted-foreground mt-4 text-sm italic">{t("empty")}</p>
        )}
      </div>
    </SectionCard>
  );
};
