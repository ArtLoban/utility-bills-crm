import { useTranslations } from "next-intl";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";
import { SheetDialog } from "@/components/sheet-dialog";
import { DateRangeFilter } from "@/components/date-range-filter";
import { Form } from "@/components/ui/form";
import { FormSelectField } from "@/components/form/form-select-field";
import { FiltersFormField, type TQueryFilters } from "../../../types";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryFilters: TQueryFilters;
};

export const FilterSheet = ({ open, onOpenChange, queryFilters }: TProps) => {
  const t = useTranslations("bills.list.filters");
  const { form, values, handleClear } = queryFilters;
  const { properties } = useBillsTable();
  const serviceOptions = useServiceOptions();

  const handleClose = () => {
    handleClear();
    onOpenChange(false);
  };

  return (
    <SheetDialog
      title={t("label")}
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      closeLabel={t("clear")}
    >
      <Form {...form}>
        <div className="flex flex-col gap-3">
          <FormSelectField
            control={form.control}
            name={FiltersFormField.PROPERTY_ID}
            label={t("property")}
            placeholder={t("allProperties")}
            options={properties}
            clearable
          />
          <FormSelectField
            control={form.control}
            name={FiltersFormField.SERVICES}
            label={t("service")}
            placeholder={t("allServices")}
            options={serviceOptions}
            clearable
          />
          <DateRangeFilter form={form} values={values} orientation="stacked" />
        </div>
      </Form>
    </SheetDialog>
  );
};
