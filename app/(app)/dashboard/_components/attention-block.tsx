import type { ReactNode } from "react";
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

type TAttentionItem = {
  key: string;
  message: ReactNode;
  href: string;
  linkLabel: string;
};

export const AttentionBlock = async ({ data }: TProps) => {
  const { totalDebt, debtServicesCount, missingReadingsCount, currentMonth } = data;

  const t = await getTranslations("dashboard.attention");
  const format = await getFormatter();
  const locale = await getLocale();
  const monthLabel = format.dateTime(currentMonth, { year: "numeric", month: "long" });

  const items: TAttentionItem[] = [];

  if (debtServicesCount > 0) {
    items.push({
      key: "debt",
      message: t.rich("debt", {
        em: (chunks) => <strong className="text-destructive font-semibold">{chunks}</strong>,
        amount: formatMoney(totalDebt, locale),
        count: debtServicesCount,
      }),
      href: ROUTES.bills,
      linkLabel: t("viewDetails"),
    });
  }

  if (missingReadingsCount > 0) {
    items.push({
      key: "missing",
      message: t.rich("missingReading", {
        em: (chunks) => <strong className="font-semibold">{chunks}</strong>,
        month: monthLabel,
        count: missingReadingsCount,
      }),
      href: ROUTES.meters,
      linkLabel: t("goToMeters"),
    });
  }

  return (
    <Surface
      elevation="sm"
      className="border-l-warning flex flex-col gap-3 border-l-4 px-4 py-5 shadow-xs md:px-6"
    >
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={18} className="text-warning" />
        <h3 className="text-foreground m-0 text-sm font-semibold">{t("title")}</h3>
      </div>

      <ul className="m-0 flex flex-col gap-2.5 p-0 [list-style:none]">
        {items.map((item) => (
          <li
            key={item.key}
            className="text-foreground flex flex-col gap-1 text-sm sm:flex-row sm:items-baseline sm:gap-2.5"
          >
            <div className="flex flex-1 items-baseline gap-2.5">
              <span className="text-muted-foreground w-2 shrink-0">•</span>
              <span className="flex-1">{item.message}</span>
            </div>
            <Link
              href={item.href}
              className="text-primary ml-4.5 inline-flex shrink-0 items-center gap-0.5 self-start text-sm font-medium no-underline sm:ml-0 sm:self-auto"
            >
              {item.linkLabel}
              <ChevronRight size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </Surface>
  );
};
