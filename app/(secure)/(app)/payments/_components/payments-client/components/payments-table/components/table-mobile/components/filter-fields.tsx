"use client";

import { useTranslations } from "next-intl";

import { DateRangeFilter } from "@/components/date-range-filter";
import { FormSelectField } from "@/components/form/form-select-field";
import { Form } from "@/components/ui/form";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";
import { usePaymentsTable } from "@/app/(secure)/(app)/payments/_components/payments-client/context";

import { FiltersFormField, type TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
};

export const FilterFields = ({ queryFilters }: TProps) => {
  const t = useTranslations("payments.list.filters");
  const { form, values } = queryFilters;
  const { properties } = usePaymentsTable();
  const serviceOptions = useServiceOptions();

  return (
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
  );
};
