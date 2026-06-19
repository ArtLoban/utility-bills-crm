import Link from "next/link";
import { Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/section-card";
import type { TPropertyRole } from "@/lib/db/schema/properties";

type TProps = {
  notes: string | null;
  editHref: string;
  role: TPropertyRole;
};

export const NotesCard = async ({ notes, editHref, role }: TProps) => {
  const t = await getTranslations("services.detail.notes");

  return (
    <SectionCard
      title={t("title")}
      actions={
        role !== "viewer" && (
          <Button variant="outline" size="icon" asChild aria-label={t("edit")}>
            <Link href={editHref}>
              <Pencil className="size-3.5" />
            </Link>
          </Button>
        )
      }
    >
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
