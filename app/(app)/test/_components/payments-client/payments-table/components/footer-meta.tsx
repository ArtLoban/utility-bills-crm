import { formatUAH } from "@/lib/format/currency";
import { useTranslations } from "next-intl";
import { TPayment } from "@/app/(app)/payments/_data/mock";

type TProps = {
  filteredData?: TPayment[];
};

export const FooterMeta = ({ filteredData }: TProps) => {
  const t = useTranslations("payments.list");

  if (!filteredData) return;

  const total = filteredData.reduce((sum, item) => {
    return sum + item.amount;
  }, 0);

  return (
    <span className="text-muted-foreground text-sm">
      {t("footer.totalPaid")}:{" "}
      <span className="font-bold text-green-600 tabular-nums dark:text-green-500">
        {formatUAH(total)}
      </span>
    </span>
  );
};
