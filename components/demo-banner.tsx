import Link from "next/link";
import { useTranslations } from "next-intl";

import { ROUTES } from "@/lib/routes";

export const DemoBanner = () => {
  const t = useTranslations("common.demoBanner");

  return (
    <div className="border-brand-border bg-brand-bg flex items-center justify-center gap-2 border-b px-4 py-2 text-sm">
      <span className="text-muted-foreground">{t("message")}</span>
      <span className="text-muted-foreground">·</span>
      <Link href={ROUTES.login} className="text-brand font-medium underline underline-offset-2">
        {t("cta")}
      </Link>
    </div>
  );
};
