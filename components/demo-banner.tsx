import { useTranslations } from "next-intl";

import { signOutToGoogleAction } from "@/lib/auth/actions";

export const DemoBanner = () => {
  const t = useTranslations("common.demoBanner");

  return (
    <div className="border-brand-border bg-brand-bg flex items-center justify-center gap-2 border-b px-4 py-2 text-sm">
      <span className="text-muted-foreground">{t("message")}</span>
      <span className="text-muted-foreground">·</span>
      <form action={signOutToGoogleAction}>
        <button
          type="submit"
          className="text-brand cursor-pointer font-medium underline underline-offset-2"
        >
          {t("cta")}
        </button>
      </form>
    </div>
  );
};
