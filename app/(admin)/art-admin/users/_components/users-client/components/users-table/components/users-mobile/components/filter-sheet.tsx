"use client";

import { SheetDialog } from "@/components/sheet-dialog";
import { Form } from "@/components/ui/form";
import { FormSelectField } from "@/components/form/form-select-field";

import { ROLE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from "../../../constants";
import { FiltersFormField, type TQueryFilters } from "../../../types";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryFilters: TQueryFilters;
  onClear: () => void;
};

export const FilterSheet = ({ open, onOpenChange, queryFilters, onClear }: TProps) => {
  const { form } = queryFilters;

  const handleClose = () => {
    onClear();
    onOpenChange(false);
  };

  return (
    <SheetDialog
      title="Filters"
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      closeLabel="Clear filters"
    >
      <Form {...form}>
        <div className="flex flex-col gap-3">
          <FormSelectField
            control={form.control}
            name={FiltersFormField.STATUS}
            label="Status"
            options={STATUS_FILTER_OPTIONS}
          />
          <FormSelectField
            control={form.control}
            name={FiltersFormField.ROLE}
            label="Role"
            placeholder="Role"
            options={ROLE_FILTER_OPTIONS}
            clearable
          />
        </div>
      </Form>
    </SheetDialog>
  );
};
