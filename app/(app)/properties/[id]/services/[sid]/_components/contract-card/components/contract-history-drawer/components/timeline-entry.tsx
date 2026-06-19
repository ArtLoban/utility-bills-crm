"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/format/date";
import type { TContractWithProvider } from "@/lib/db/access/contracts";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";

type TProps = {
  item: TContractWithProvider;
  isLast: boolean;
  tariffs: TTariff[];
  accountNumbers: TAccountNumber[];
  paymentDetails: TPaymentDetails[];
};

const NestedRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-muted-foreground min-w-28 text-xs">{label}</span>
    <span className="text-foreground text-xs break-all">{value}</span>
  </div>
);

const SECTION_LABEL_CLASS =
  "mb-1.5 text-muted-foreground text-[11px] font-semibold tracking-wide uppercase";
const PERIOD_CLASS = "text-muted-foreground min-w-32 text-xs";
const PERIOD_VALUE_CLASS = "text-foreground text-xs tabular-nums";

export const TimelineEntry = ({
  item,
  isLast,
  tariffs,
  accountNumbers,
  paymentDetails,
}: TProps) => {
  const t = useTranslations("services.detail.history");
  const { contract, provider } = item;
  const isCurrent = contract.validTo === null;
  const hasAttributes =
    tariffs.length > 0 || accountNumbers.length > 0 || paymentDetails.length > 0;

  const formatRange = (validFrom: Date, validTo: Date | null): string =>
    `${formatDisplayDate(validFrom)} — ${validTo ? formatDisplayDate(validTo) : t("present")}`;

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
      <div className="flex w-7 flex-col items-center">
        <div
          className={cn(
            "mt-3.5 size-3 shrink-0 rounded-full",
            isCurrent ? "bg-primary ring-primary/15 ring-4" : "bg-muted-foreground/40",
          )}
        />
        {!isLast && <div className="bg-border mt-1.5 w-0.5 flex-1" />}
      </div>

      <div
        className={cn(
          "mb-5 ml-3 flex-1 overflow-hidden rounded-[8px] border last:mb-0",
          isCurrent ? "border-primary/20 bg-primary/5" : "border-border bg-card",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between border-b px-4 py-3",
            isCurrent ? "border-primary/20 bg-primary/10" : "border-border bg-muted/40",
          )}
        >
          <span className="text-foreground text-[13px] font-semibold">
            {formatRange(contract.validFrom, contract.validTo)}
          </span>
          {isCurrent && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[11px] font-semibold">
              {t("current")}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2.5 px-4 py-3.5">
          <NestedRow label={t("provider")} value={provider.name} />
          {contract.notes && <NestedRow label={t("notes")} value={contract.notes} />}

          {hasAttributes && (
            <div className="border-border bg-muted/40 mt-1 flex flex-col gap-2 rounded-md border px-3 py-2.5">
              {tariffs.length > 0 && (
                <div>
                  <p className={SECTION_LABEL_CLASS}>{t("tariffPeriods")}</p>
                  <div className="flex flex-col gap-1.5">
                    {tariffs.map((tariff) => (
                      <div key={tariff.id} className="flex items-start gap-2">
                        <span className={PERIOD_CLASS}>
                          {formatRange(tariff.validFrom, tariff.validTo)}
                        </span>
                        <span className={PERIOD_VALUE_CLASS}>{formatTariff(tariff)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {accountNumbers.length > 0 && (
                <div>
                  <p className={SECTION_LABEL_CLASS}>{t("accountNumbers")}</p>
                  <div className="flex flex-col gap-1.5">
                    {accountNumbers.map((account) => (
                      <div key={account.id} className="flex items-start gap-2">
                        <span className={PERIOD_CLASS}>
                          {formatRange(account.validFrom, account.validTo)}
                        </span>
                        <span className={cn(PERIOD_VALUE_CLASS, "break-all")}>{account.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentDetails.length > 0 && (
                <div>
                  <p className={SECTION_LABEL_CLASS}>{t("paymentDetails")}</p>
                  <div className="flex flex-col gap-1.5">
                    {paymentDetails.map((pd) => (
                      <div key={pd.id} className="flex items-start gap-2">
                        <span className={PERIOD_CLASS}>
                          {formatRange(pd.validFrom, pd.validTo)}
                        </span>
                        <span className="text-foreground font-mono text-xs break-all whitespace-pre-wrap">
                          {pd.details}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
