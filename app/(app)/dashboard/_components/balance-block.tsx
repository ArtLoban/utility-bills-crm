import Link from "next/link";
import { Home, TreePine, ChevronRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

import { DataCard } from "@/components/data-card";
import { formatMoney } from "@/lib/format/money";
import { cn } from "@/lib/utils";
import type { TBalanceData } from "../_data/types";

type TProps = {
  data: TBalanceData;
};

const balanceColor = (balance: number): string => {
  if (balance < 0) return "var(--destructive)";
  if (balance > 0) return "var(--success)";
  return "var(--muted-foreground)";
};

export const BalanceBlock = async ({ data }: TProps) => {
  const { totalDebt, debtServicesCount, totalOverpayment, overpayServicesCount, byProperty } = data;

  const t = await getTranslations("dashboard.balance");
  const locale = await getLocale();

  const formatBalance = (balance: number): string => {
    const sign = balance < 0 ? "−" : "+";
    return `${sign}${formatMoney(Math.abs(balance), locale)}`;
  };

  return (
    <DataCard className="overflow-hidden">
      {/* Top section — summary KV grid */}
      <div className="border-b px-6 pt-5 pb-4">
        <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t("title")}
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-8">
          {/* Total debt */}
          <div>
            <div className="text-muted-foreground mb-1.5 text-xs">{t("totalDebt")}</div>
            <div className="text-destructive text-2xl leading-none font-semibold tracking-tight tabular-nums md:text-3xl">
              {"−"}
              {formatMoney(totalDebt, locale)}
            </div>
            <div className="text-muted-foreground mt-1.5 text-xs">
              {t("acrossServices", { count: debtServicesCount })}
            </div>
          </div>

          {/* Total overpayment */}
          <div>
            <div className="text-muted-foreground mb-1.5 text-xs">{t("totalOverpayment")}</div>
            <div className="text-success text-2xl leading-none font-semibold tracking-tight tabular-nums md:text-3xl">
              {"+"}
              {formatMoney(totalOverpayment, locale)}
            </div>
            <div className="text-muted-foreground mt-1.5 text-xs">
              {t("acrossServices", { count: overpayServicesCount })}
            </div>
          </div>
        </div>
      </div>

      {/* By property section */}
      <div>
        <div className="text-muted-foreground px-6 pt-3 pb-2 text-xs font-medium tracking-wide uppercase">
          {t("byProperty")}
        </div>

        <div>
          {byProperty.map((property, i) => {
            const isLast = i === byProperty.length - 1;
            return (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className={cn(
                  "hover:bg-muted flex items-center gap-3 px-6 py-3 no-underline transition-colors duration-100",
                  !isLast && "border-border border-b",
                )}
              >
                <div className="bg-muted flex size-7.5 shrink-0 items-center justify-center rounded-sm">
                  {property.type === "cottage" ? (
                    <TreePine size={15} className="text-muted-foreground" />
                  ) : (
                    <Home size={15} className="text-muted-foreground" />
                  )}
                </div>

                <div className="text-foreground min-w-0 flex-1 text-sm font-medium">
                  {property.name}
                </div>

                <div
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: balanceColor(property.balance) }}
                >
                  {formatBalance(property.balance)}
                </div>

                <ChevronRight size={15} className="text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </div>
    </DataCard>
  );
};
