import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { getTranslations, getFormatter, getLocale } from "next-intl/server";

import { formatMoney } from "@/lib/format/money";
import { ROUTES } from "@/lib/routes";
import type { TAttentionData } from "../_data/types";
import { Surface } from "@/components/surface";

type TProps = {
  data: TAttentionData;
};

export const AttentionBlock = async ({ data }: TProps) => {
  const { totalDebt, debtServicesCount, missingReadingsCount, currentMonth } = data;

  const t = await getTranslations("dashboard.attention");
  const format = await getFormatter();
  const locale = await getLocale();
  const monthLabel = format.dateTime(currentMonth, { year: "numeric", month: "long" });

  return (
    <Surface
      elevation="sm"
      className="border-l-warning flex flex-col gap-3 border-l-4 px-4 py-5 shadow-xs md:px-6"
    >
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={18} className="text-warning" />
        <h3 className="text-foreground m-0 text-sm font-semibold">{t("title")}</h3>
      </div>

      <ul className="m-0 flex flex-col gap-2 p-0 [list-style:none]">
        {debtServicesCount > 0 && (
          <li className="text-foreground flex items-baseline gap-2.5 text-sm">
            <span className="text-muted-foreground w-2">•</span>
            <span className="flex-1">
              {t.rich("debt", {
                em: (chunks) => (
                  <strong className="text-destructive font-semibold">{chunks}</strong>
                ),
                amount: formatMoney(totalDebt, locale),
                count: debtServicesCount,
              })}
            </span>
            <Link
              href={ROUTES.bills}
              className="text-primary inline-flex shrink-0 items-center gap-0.5 text-sm font-medium no-underline"
            >
              {t("viewDetails")}
              <ChevronRight size={14} />
            </Link>
          </li>
        )}

        {missingReadingsCount > 0 && (
          <li className="text-foreground flex items-baseline gap-2.5 text-sm">
            <span className="text-muted-foreground w-2">•</span>
            <span className="flex-1">
              {t.rich("missingReading", {
                em: (chunks) => <strong className="font-semibold">{chunks}</strong>,
                month: monthLabel,
                count: missingReadingsCount,
              })}
            </span>
            <Link
              href={ROUTES.meters}
              className="text-primary inline-flex shrink-0 items-center gap-0.5 text-sm font-medium no-underline"
            >
              {t("goToMeters")}
              <ChevronRight size={14} />
            </Link>
          </li>
        )}
      </ul>
    </Surface>
  );
};
