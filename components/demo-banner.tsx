import { useTranslations } from "next-intl";

import { signOutToGoogleAction } from "@/lib/auth/actions";
import { Button } from "./ui/button";

export const DemoBanner = () => {
  const t = useTranslations("common.demoBanner");

  return (
    <div className="border-brand-border bg-brand-bg flex flex-col items-center justify-center gap-0.5 border-b px-4 py-2 text-center text-sm sm:flex-row sm:gap-2">
      <span className="text-muted-foreground">{t("message")}</span>
      <span className="text-muted-foreground hidden sm:inline">·</span>
      <form action={signOutToGoogleAction}>
        <Button variant="link" type="submit" className="px-0">
          {t("cta")}
        </Button>
      </form>
    </div>
  );
};
