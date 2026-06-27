"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

export const ReplacementInfo = () => {
  const t = useTranslations("meters.replaceForm.info");

  return (
    <div className="border-border rounded-lg border p-3.5">
      <div className="flex items-start gap-2.5">
        <Info size={15} className="text-muted-foreground mt-0.5 shrink-0" />
        <div className="text-muted-foreground flex flex-col gap-1 text-xs leading-relaxed">
          <span>{t("current")}</span>
          <span>{t("history")}</span>
          <span>{t("fresh")}</span>
        </div>
      </div>
    </div>
  );
};
