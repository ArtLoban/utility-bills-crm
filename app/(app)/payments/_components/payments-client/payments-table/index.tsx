"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { TPayment } from "@/app/(app)/payments/_data/mock";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTableFilters } from "@/components/data-table/data-table/hooks/use-data-table-filters";
import { ConfirmDialog } from "@/components/confirm-dialog";

import { URL_FIELDS } from "./constants";
import { FiltersFormField, type TDeleteTarget } from "./types";
import { getPaymentsColumns } from "./utils/get-table-columns";
import { FiltersBar } from "./components/filters-bar";
import { FooterMeta } from "./components/footer-meta";

type TProps = {
  data: TPayment[];
  filteredData: TPayment[] | null;
  setFilteredData: (data: TPayment[]) => void;
};

export const PaymentsTable = ({ data, filteredData, setFilteredData }: TProps) => {
  const [query] = useQueryStates(URL_FIELDS);
  const t = useTranslations("payments.list");

  const [confirmTarget, setConfirmTarget] = useState<TDeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns = getPaymentsColumns(t, setConfirmTarget);
  const columnFilters = useDataTableFilters(query);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setIsDeleting(true);
    try {
      // devnote: wire to deletePayment server action when payments table exists
      await new Promise<void>((resolve) => setTimeout(resolve, 400));
      toast.success("Payment deleted");
      setConfirmTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="hidden md:block">
      <FiltersBar />
      <DataTable
        data={data}
        columns={columns}
        columnFilters={columnFilters}
        defaultSorting={{ sortBy: FiltersFormField.PAID_AT }}
        footerMeta={<FooterMeta filteredData={filteredData ?? undefined} />}
        onRowsChange={setFilteredData}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        onOpenChange={(open) => !open && setConfirmTarget(null)}
        title="Delete Payment"
        tone="destructive"
        icon={<Trash2 size={28} />}
        description={
          <>
            Delete <strong>{confirmTarget?.serviceName ?? ""}</strong> payment for{" "}
            <strong>{confirmTarget?.propertyName ?? ""}</strong>? This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        confirmIcon={<Trash2 size={14} />}
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
};
