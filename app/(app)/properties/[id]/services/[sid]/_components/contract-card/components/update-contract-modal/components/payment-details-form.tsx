"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn, useWatch } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { Textarea } from "@/components/ui/textarea";
import {
  PAYMENT_DETAILS_LIMITS,
  type TChangePaymentDetailsForm,
} from "@/features/payment-details/schema";
import { UPDATE_CONTRACT_NAMESPACE } from "../constants";
import { PaymentFormField } from "../types";
import { ChangeCallout } from "./change-callout";

type TProps = {
  form: UseFormReturn<TChangePaymentDetailsForm>;
};

export const PaymentDetailsForm = ({ form }: TProps) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;
  const changeDate = useWatch({ control, name: PaymentFormField.CHANGE_DATE });

  return (
    <Form {...form}>
      <FormFields>
        <FormDateField
          control={control}
          name={PaymentFormField.CHANGE_DATE}
          label={t("fields.effectiveFrom")}
          required
        />

        <FormField
          control={control}
          name={PaymentFormField.DETAILS}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.newPayment")}</FormLabel>
              <FormDescription>{t("fields.paymentHint")}</FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={5}
                  placeholder={t("fields.paymentPlaceholder")}
                  maxLength={PAYMENT_DETAILS_LIMITS.details}
                  className="resize-y font-mono leading-relaxed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormTextareaField
          control={control}
          name={PaymentFormField.NOTES}
          label={t("fields.notesOptional")}
          maxLength={PAYMENT_DETAILS_LIMITS.notes}
          rows={2}
        />

        <ChangeCallout changeDate={changeDate} messageKey="callout.payment" />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
