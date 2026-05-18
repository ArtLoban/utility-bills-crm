import { formatUAH } from "@/lib/format/currency";
import { useTranslations } from "next-intl";
import type { Table } from "@tanstack/react-table";
import { TPayment } from "@/app/(app)/payments/_data/mock";

type TProps = {
  table: Table<TPayment>;
};

export const FooterMeta = ({ table }: TProps) => {
  const t = useTranslations("payments.list");

  const filteredTotal = table
    .getFilteredRowModel()
    .rows.reduce((sum, row) => sum + row.original.amount, 0);

  return (
    <span className="text-muted-foreground text-sm">
      {t("footer.totalPaid")}:{" "}
      <span className="font-bold text-green-600 tabular-nums dark:text-green-500">
        {formatUAH(filteredTotal)}
      </span>
    </span>
  );
};
