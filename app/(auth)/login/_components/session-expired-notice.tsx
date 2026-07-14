import { getTranslations } from "next-intl/server";
import { TriangleAlert } from "lucide-react";

export const SessionExpiredNotice = async () => {
  const t = await getTranslations("common");

  return (
    <div
      role="status"
      className="mb-6 flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm"
      style={{
        borderColor: "var(--warning)",
        background: "color-mix(in srgb, var(--warning) 8%, transparent)",
      }}
    >
      <TriangleAlert
        className="size-4 shrink-0"
        style={{ color: "var(--warning)" }}
        strokeWidth={2}
      />
      <span className="text-zinc-700 dark:text-zinc-300">{t("sessionExpired")}</span>
    </div>
  );
};
