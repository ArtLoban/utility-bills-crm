"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormTextField } from "@/components/form/form-text-field";
import { type TInviteFormValues } from "@/features/sharing/schema";
import { InviteFormField } from "@/features/sharing/types";

import { RoleField } from "./components/role-field";

type TProps = {
  form: UseFormReturn<TInviteFormValues>;
};

export const InviteForm = ({ form }: TProps) => {
  const t = useTranslations("sharing.inviteModal");

  return (
    <Form {...form}>
      <FormFields>
        <FormTextField
          control={form.control}
          name={InviteFormField.EMAIL}
          type="email"
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          description={t("emailHint")}
          autoFocus
          required
        />

        <RoleField control={form.control} />
      </FormFields>
    </Form>
  );
};
