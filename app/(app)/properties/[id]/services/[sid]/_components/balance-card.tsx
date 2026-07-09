"use client";

import { Receipt, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { LinkButton } from "@/components/link-button";
import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";
import { ROUTES } from "@/lib/routes";
import { formatMoney } from "@/lib/format/money";
import type { TBalance } from "@/features/ledger";

type TProps = {
  balance: TBalance;
};

export const BalanceCard = ({ balance }: TProps) => {
  const locale = useLocale();
  const t = useTranslations("services.detail.balance");

  if (balance.billsTotal === 0 && balance.paymentsTotal === 0) {
    return (
      <SectionCard>
        <SectionCardEmpty icon={Wallet} caption={t("empty")} />
      </SectionCard>
    );
  }

  const { balance: owed } = balance;
  const amount = formatMoney(Math.abs(owed), locale);
  const amountColor = owed > 0 ? "text-destructive" : owed < 0 ? "text-success" : "text-foreground";
  const subline =
    owed > 0 ? t("owe", { amount }) : owed < 0 ? t("credit", { amount }) : t("settled");

  return (
    <SectionCard>
      <div className="px-4 pt-6 pb-5 sm:px-6">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t("eyebrow")}
        </p>
        <p
          className={`mt-3 font-bold tracking-tight tabular-nums ${amountColor}`}
          style={{ fontSize: "var(--font-size-display)" }}
        >
          {amount}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">{subline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <LinkButton href={ROUTES.bills} icon={Receipt} text={t("viewBills")} />
          <LinkButton href={ROUTES.payments} icon={Wallet} text={t("viewPayments")} />
        </div>
      </div>
    </SectionCard>
  );
};
