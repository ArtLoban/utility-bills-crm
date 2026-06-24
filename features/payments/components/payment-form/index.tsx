"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormSelectField } from "@/components/form/form-select-field";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { ReadOnlyField } from "@/components/read-only-field";
import { ISO_DATE_FORMAT } from "@/lib/format/date";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TBalance } from "@/features/ledger/types";
import type { PropertyId } from "@/lib/db/schema/properties";
import { PAYMENT_LIMITS, type TPaymentFormValues } from "@/features/payments/schema";
import { PaymentFormField } from "@/features/payments/types";

type TServiceItem = { id: string; name: string };

type TProps = {
  form: UseFormReturn<TPaymentFormValues>;
  isEditMode: boolean;
  properties: { id: PropertyId; name: string }[];
  availableServices: TServiceItem[];
  currentDebt: TBalance | null;
  onPropertyChange: () => void;
  lockedPropertyName?: string;
  lockedServiceLabel?: string;
};

export const PaymentForm = ({
  form,
  isEditMode,
  properties,
  availableServices,
  currentDebt,
  onPropertyChange,
  lockedPropertyName,
  lockedServiceLabel,
}: TProps) => {
  const t = useTranslations("payments.fields");
  const formatMoney = useFormatMoney();
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  const hasProperty = Boolean(form.watch(PaymentFormField.PROPERTY));
  const debtHint =
    currentDebt && currentDebt.balance > 0
      ? t("amount.currentDebt", { amount: formatMoney(currentDebt.balance) })
      : undefined;

  return (
    <Form {...form}>
      <FormFields>
        {isEditMode ? (
          <ReadOnlyField label={t("property.label")}>{lockedPropertyName}</ReadOnlyField>
        ) : (
          <FormSelectField
            control={control}
            name={PaymentFormField.PROPERTY}
            label={t("property.label")}
            placeholder={t("property.placeholder")}
            options={properties}
            onValueChange={onPropertyChange}
            required
          />
        )}

        {isEditMode ? (
          <ReadOnlyField label={t("service.label")}>{lockedServiceLabel}</ReadOnlyField>
        ) : (
          <FormSelectField
            control={control}
            name={PaymentFormField.SERVICE_ID}
            label={t("service.label")}
            placeholder={
              hasProperty ? t("service.placeholder") : t("service.placeholderNoProperty")
            }
            options={availableServices}
            disabled={availableServices.length === 0}
            required
          />
        )}

        <FormDateField
          control={control}
          name={PaymentFormField.PAID_AT}
          label={t("paidAt.label")}
          max={format(new Date(), ISO_DATE_FORMAT)}
          required
        />

        <FormTextField
          control={control}
          name={PaymentFormField.AMOUNT}
          label={t("amount.label")}
          placeholder={t("amount.placeholder")}
          type="number"
          inputMode="decimal"
          description={debtHint}
          required
        />

        <FormTextareaField
          control={control}
          name={PaymentFormField.NOTES}
          label={t("notes.label")}
          placeholder={t("notes.placeholder")}
          maxLength={PAYMENT_LIMITS.notes}
          rows={3}
        />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
