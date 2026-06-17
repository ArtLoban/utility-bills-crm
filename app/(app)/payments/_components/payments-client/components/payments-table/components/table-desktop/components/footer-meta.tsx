"use client";

import { useTranslations } from "next-intl";

import { useFormatMoney } from "@/lib/format/use-format-money";

type TProps = {
  totalAmount: string;
};

export const FooterMeta = ({ totalAmount }: TProps) => {
  const t = useTranslations("payments.list");
  const formatMoney = useFormatMoney();

  return (
    <span className="text-muted-foreground text-sm">
      {t("footer.totalPaid")}:{" "}
      <span className="text-success font-semibold tabular-nums">{formatMoney(totalAmount)}</span>
    </span>
  );
};
