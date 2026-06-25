"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn, useWatch } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import {
  ACCOUNT_NUMBER_LIMITS,
  type TChangeAccountNumberForm,
} from "@/features/account-numbers/schema";
import { UPDATE_CONTRACT_NAMESPACE } from "../constants";
import { AccountFormField } from "../types";
import { ChangeCallout } from "./change-callout";

type TProps = {
  form: UseFormReturn<TChangeAccountNumberForm>;
};

export const AccountNumberForm = ({ form }: TProps) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;
  const changeDate = useWatch({ control, name: AccountFormField.CHANGE_DATE });

  return (
    <Form {...form}>
      <FormFields>
        <FormDateField
          control={control}
          name={AccountFormField.CHANGE_DATE}
          label={t("fields.effectiveFrom")}
          required
        />

        <FormTextField
          control={control}
          name={AccountFormField.VALUE}
          label={t("fields.newAccount")}
          placeholder={t("fields.accountPlaceholder")}
          maxLength={ACCOUNT_NUMBER_LIMITS.value}
          required
        />

        <FormTextareaField
          control={control}
          name={AccountFormField.NOTES}
          label={t("fields.notesOptional")}
          maxLength={ACCOUNT_NUMBER_LIMITS.notes}
          rows={2}
        />

        <ChangeCallout changeDate={changeDate} messageKey="callout.account" />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
