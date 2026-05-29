"use client";

import { useTranslations } from "next-intl";

import { formatUAH } from "@/lib/format/currency";

type TProps = {
  totalAmount: string;
};

export const FooterMeta = ({ totalAmount }: TProps) => {
  const t = useTranslations("bills.list");

  return (
    <span className="text-muted-foreground text-sm">
      {t("footer.total")}:{" "}
      <span className="font-semibold tabular-nums">{formatUAH(Number(totalAmount))}</span>
    </span>
  );
};
