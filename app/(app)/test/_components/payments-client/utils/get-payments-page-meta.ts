import { formatUAH } from "@/lib/format/currency";
import { TPayment } from "@/app/(app)/payments/_data/mock";
import { useTranslations } from "next-intl";

type TTranslateFn = ReturnType<typeof useTranslations<"payments.list">>;

export const getPaymentsPageMeta = (payments: TPayment[], t: TTranslateFn) => {
  const total = payments.reduce((sum, { amount }) => sum + Number(amount), 0);

  return [t("meta.records", { count: payments.length }), formatUAH(total)];
};
