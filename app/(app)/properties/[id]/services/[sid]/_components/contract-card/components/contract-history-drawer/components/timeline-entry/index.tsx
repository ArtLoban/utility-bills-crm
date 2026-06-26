"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { TContractWithProvider } from "@/lib/db/access/contracts";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";
import { NestedRow } from "./components/nested-row";
import { TemporalAttributeSection } from "./components/temporal-attribute-section";
import { formatPeriod } from "./utils";

type TProps = {
  item: TContractWithProvider;
  isLast: boolean;
  tariffs: TTariff[];
  accountNumbers: TAccountNumber[];
  paymentDetails: TPaymentDetails[];
};

const PERIOD_VALUE_CLASS = "text-foreground text-xs tabular-nums";

export const TimelineEntry = ({
  item,
  isLast,
  tariffs,
  accountNumbers,
  paymentDetails,
}: TProps) => {
  const { contract, provider } = item;
  const t = useTranslations("services.detail.history");
  const isCurrent = contract.validTo === null;
  const present = t("present");

  const hasAttributes =
    tariffs.length > 0 || accountNumbers.length > 0 || paymentDetails.length > 0;

  const formatTariff = (tariff: TTariff): string => {
    if (tariff.fixedAmount !== null) return t("fixedRate", { amount: tariff.fixedAmount });

    return [
      `T1: ${tariff.rateT1}`,
      tariff.rateT2 && `T2: ${tariff.rateT2}`,
      tariff.rateT3 && `T3: ${tariff.rateT3}`,
    ]
      .filter(Boolean)
      .join(" · ");
  };

  return (
    <div className="flex">
      <div className="hidden w-7 flex-col items-center sm:flex">
        <div
          className={cn(
            "mt-3.5 size-3 shrink-0 rounded-full",
            isCurrent ? "bg-primary ring-primary/15 ring-4" : "bg-muted-foreground/40",
          )}
        />
        {!isLast && <div className="bg-border mt-3.5 -mb-6 w-0.5 flex-1" />}
      </div>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-lg border sm:ml-3",
          isCurrent ? "border-primary/20 bg-primary/5" : "border-border bg-card",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between border-b px-4 py-3",
            isCurrent ? "border-primary/20 bg-primary/10" : "border-border bg-muted/40",
          )}
        >
          <span className="text-foreground text-sm">
            {formatPeriod(contract.validFrom, contract.validTo, present)}
          </span>
          {isCurrent && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {t("current")}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2.5 px-4 py-3.5">
          <NestedRow label={t("provider")} value={provider.name} />
          {contract.notes && <NestedRow label={t("notes")} value={contract.notes} />}

          {hasAttributes && (
            <div className="border-border bg-muted/40 mt-1 flex flex-col gap-4 rounded-md border px-3 py-2.5">
              {tariffs.length > 0 && (
                <TemporalAttributeSection
                  label={t("tariffPeriods")}
                  items={tariffs}
                  presentLabel={present}
                  renderValue={(tariff) => (
                    <span className={PERIOD_VALUE_CLASS}>{formatTariff(tariff)}</span>
                  )}
                />
              )}

              {accountNumbers.length > 0 && (
                <TemporalAttributeSection
                  label={t("accountNumbers")}
                  items={accountNumbers}
                  presentLabel={present}
                  renderValue={(account) => (
                    <span className={cn(PERIOD_VALUE_CLASS, "break-all")}>{account.value}</span>
                  )}
                />
              )}

              {paymentDetails.length > 0 && (
                <TemporalAttributeSection
                  label={t("paymentDetails")}
                  items={paymentDetails}
                  presentLabel={present}
                  renderValue={(pd) => (
                    <span className="text-foreground font-mono text-xs break-all whitespace-pre-wrap">
                      {pd.details}
                    </span>
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
