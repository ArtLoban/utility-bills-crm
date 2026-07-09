import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ExternalLink, TriangleAlert } from "lucide-react";

import { ROUTES } from "@/lib/routes";

export const DisconnectedBanner = async () => {
  const t = await getTranslations("reminders.disconnected");

  return (
    <div className="border-warning/30 bg-warning/10 flex items-center gap-2.5 border-b px-4 py-3 sm:px-5">
      <TriangleAlert size={15} className="text-warning shrink-0" />
      <p className="text-foreground flex-1 text-sm">{t("message")}</p>
      <Link
        href={ROUTES.settings}
        className="text-warning flex shrink-0 items-center gap-1 text-sm font-medium"
      >
        {t("cta")}
        <ExternalLink size={13} />
      </Link>
    </div>
  );
};
