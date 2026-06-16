import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { TriangleAlert } from "lucide-react";

import { ROUTES } from "@/lib/routes";

export const DisconnectedBanner = async () => {
  const t = await getTranslations("reminders.disconnected");

  return (
    <div className="border-warning/30 bg-warning/10 mx-5 mt-4 flex items-start gap-2 rounded-md border px-3 py-2.5">
      <TriangleAlert size={15} className="text-warning mt-0.5 shrink-0" />
      <p className="text-foreground text-sm">
        {t("message")}{" "}
        <Link
          href={ROUTES.settings}
          className="text-warning font-medium underline underline-offset-2"
        >
          {t("cta")}
        </Link>
      </p>
    </div>
  );
};
