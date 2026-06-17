import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { getTranslations, getFormatter, getLocale } from "next-intl/server";

import { DataCard } from "@/components/data-card";
import { formatMoney } from "@/lib/format/money";
import type { TAttentionData } from "../_data/types";

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
    <DataCard className="border-l-warning flex flex-col gap-3 border-l-4 px-6 py-5">
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={18} className="text-warning" />
        <h3 className="m-0 text-[14.5px] font-semibold tracking-[-0.1px] text-zinc-950 dark:text-zinc-50">
          {t("title")}
        </h3>
      </div>

      <ul className="m-0 flex flex-col gap-2 p-0 [list-style:none]">
        {debtServicesCount > 0 && (
          <li className="flex items-baseline gap-2.5 text-[13.5px] text-zinc-950 dark:text-zinc-50">
            <span className="w-2 text-zinc-500">•</span>
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
              href="/bills"
              className="text-primary inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium no-underline"
            >
              {t("viewDetails")}
              <ChevronRight size={14} />
            </Link>
          </li>
        )}

        {missingReadingsCount > 0 && (
          <li className="flex items-baseline gap-2.5 text-[13.5px] text-zinc-950 dark:text-zinc-50">
            <span className="w-2 text-zinc-500">•</span>
            <span className="flex-1">
              {t.rich("missingReading", {
                em: (chunks) => <strong className="font-semibold">{chunks}</strong>,
                month: monthLabel,
                count: missingReadingsCount,
              })}
            </span>
            <Link
              href="/meters"
              className="text-primary inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium no-underline"
            >
              {t("goToMeters")}
              <ChevronRight size={14} />
            </Link>
          </li>
        )}
      </ul>
    </DataCard>
  );
};
