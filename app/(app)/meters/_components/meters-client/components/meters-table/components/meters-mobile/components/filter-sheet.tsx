"use client";

import { useTranslations } from "next-intl";

import { SheetDialog } from "@/components/sheet-dialog";
import { Form } from "@/components/ui/form";
import { FormSelectField } from "@/components/form/form-select-field";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";
import { METER_STATUSES } from "@/features/meters/types";
import type { TPropertyOption } from "@/features/properties";

import { FiltersFormField, type TQueryFilters } from "../../../types";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryFilters: TQueryFilters;
  properties: TPropertyOption[];
};

export const FilterSheet = ({ open, onOpenChange, queryFilters, properties }: TProps) => {
  const t = useTranslations("meters.list.filters");
  const { form, handleClear } = queryFilters;
  const serviceOptions = useServiceOptions();

  const statusOptions = [
    { id: METER_STATUSES.ACTIVE, name: t("statusActive") },
    { id: METER_STATUSES.HISTORICAL, name: t("statusHistorical") },
    { id: METER_STATUSES.ALL, name: t("statusAll") },
  ];

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
            placeholder={t("property")}
            options={properties}
            clearable
          />
          <FormSelectField
            control={form.control}
            name={FiltersFormField.SERVICES}
            label={t("serviceType")}
            placeholder={t("serviceType")}
            options={serviceOptions}
            clearable
          />
          <FormSelectField
            control={form.control}
            name={FiltersFormField.STATUS}
            label={t("status")}
            options={statusOptions}
          />
        </div>
      </Form>
    </SheetDialog>
  );
};
