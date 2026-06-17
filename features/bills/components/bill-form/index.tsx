"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormSelectField } from "@/components/form/form-select-field";
import { FormMonthField } from "@/components/form/form-month-field";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { currentYearMonth } from "@/components/month-picker/utils";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceOption } from "@/lib/db/access/bills";
import { BILL_LIMITS, type TBillFormValues } from "@/features/bills/schema";
import { BillFormField } from "@/features/bills/types";
import type { TExpectedAmount } from "@/features/ledger/types";
import { ServiceChip } from "./components/service-chip";
import { ReadOnlyField } from "./components/read-only-field";

type TProps = {
  form: UseFormReturn<TBillFormValues>;
  isEditMode: boolean;
  propertyOptions: { id: PropertyId; name: string }[];
  availableServices: TServiceOption[];
  expectedAmount: TExpectedAmount | null;
  onPropertyChange: () => void;
  lockedPropertyName?: string;
  lockedServiceCode?: string;
};

export const BillForm = ({
  form,
  isEditMode,
  propertyOptions,
  availableServices,
  expectedAmount,
  onPropertyChange,
  lockedPropertyName,
  lockedServiceCode,
}: TProps) => {
  const t = useTranslations("bills.fields");
  const formatMoney = useFormatMoney();
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  const serviceSelectOptions = availableServices.map((service) => ({
    id: service.id,
    name: getServiceLabel(service.typeCode),
  }));

  const expectedHint =
    expectedAmount?.kind === "computed"
      ? t("amount.expected", { amount: formatMoney(expectedAmount.amount) })
      : undefined;

  return (
    <Form {...form}>
      <FormFields>
        {isEditMode ? (
          <ReadOnlyField label={t("property.label")}>{lockedPropertyName}</ReadOnlyField>
        ) : (
          <FormSelectField
            control={control}
            name={BillFormField.PROPERTY}
            label={t("property.label")}
            placeholder={t("property.placeholder")}
            options={propertyOptions}
            onValueChange={onPropertyChange}
          />
        )}

        {isEditMode ? (
          <ReadOnlyField label={t("service.label")}>
            {lockedServiceCode ? <ServiceChip serviceId={lockedServiceCode} /> : null}
          </ReadOnlyField>
        ) : (
          <FormSelectField
            control={control}
            name={BillFormField.SERVICE_ID}
            label={t("service.label")}
            placeholder={t("service.placeholder")}
            options={serviceSelectOptions}
            disabled={serviceSelectOptions.length === 0}
          />
        )}

        <FormMonthField
          control={control}
          name={BillFormField.MONTH}
          label={t("month.label")}
          placeholder={t("month.placeholder")}
          max={currentYearMonth()}
        />

        <FormTextField
          control={control}
          name={BillFormField.AMOUNT}
          label={t("amount.label")}
          placeholder={t("amount.placeholder")}
          type="number"
          inputMode="decimal"
          description={expectedHint}
        />

        <FormTextareaField
          control={control}
          name={BillFormField.NOTES}
          label={t("notes.label")}
          maxLength={BILL_LIMITS.notes}
          rows={3}
        />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
