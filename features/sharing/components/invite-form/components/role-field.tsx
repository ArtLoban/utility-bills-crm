"use client";

import { type KeyboardEvent, useRef } from "react";
import { type Control } from "react-hook-form";
import { useTranslations } from "next-intl";

import { FormFieldShell } from "@/components/form/form-field-shell";
import { type TPropertyRole } from "@/lib/db/schema/properties";
import { type TInviteFormValues } from "@/features/sharing/schema";
import { InviteFormField } from "@/features/sharing/types";

import { INVITE_ROLE_ORDER } from "../constants";
import { RoleCard } from "./role-card";

type TProps = {
  control: Control<TInviteFormValues>;
};

export const RoleField = ({ control }: TProps) => {
  const t = useTranslations("sharing.inviteModal");
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <FormFieldShell control={control} name={InviteFormField.ROLE} label={t("roleLabel")} required>
      {(field) => {
        const selectedIndex = INVITE_ROLE_ORDER.indexOf(field.value as TPropertyRole);
        const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

        const moveTo = (index: number) => {
          const count = INVITE_ROLE_ORDER.length;
          const nextIndex = (index + count) % count;
          field.onChange(INVITE_ROLE_ORDER[nextIndex]);
          cardsRef.current[nextIndex]?.focus();
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
          switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
              event.preventDefault();
              moveTo(index + 1);
              break;
            case "ArrowUp":
            case "ArrowLeft":
              event.preventDefault();
              moveTo(index - 1);
              break;
          }
        };

        return (
          <div role="radiogroup" aria-label={t("roleLabel")} className="flex flex-col gap-2">
            {INVITE_ROLE_ORDER.map((role, index) => (
              <RoleCard
                key={role}
                ref={(element) => {
                  cardsRef.current[index] = element;
                }}
                label={t(`${role}.label`)}
                helper={t(`${role}.helper`)}
                isSelected={field.value === role}
                tabIndex={index === tabbableIndex ? 0 : -1}
                onSelect={() => field.onChange(role)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              />
            ))}
          </div>
        );
      }}
    </FormFieldShell>
  );
};
