"use client";

import { useTranslations } from "next-intl";

import { formatUAH } from "@/lib/format/currency";

type TProps = {
  totalAmount: string;
};

export const FooterMeta = ({ totalAmount }: TProps) => {
  const t = useTranslations("payments.list");

  return (
    <span className="text-muted-foreground text-sm">
      {t("footer.totalPaid")}:{" "}
      <span className="font-semibold text-green-600 tabular-nums dark:text-green-500">
        {formatUAH(Number(totalAmount))}
      </span>
    </span>
  );
};
