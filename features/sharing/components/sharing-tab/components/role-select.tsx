"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changePropertyRole } from "@/features/sharing/actions";
import { errorMessage } from "@/lib/errors";
import {
  PROPERTY_ROLE_LIST,
  type PropertyId,
  type TPropertyRole,
} from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";

type TProps = {
  value: TPropertyRole;
  userId: UserId;
  propertyId: PropertyId;
};

export const RoleSelect = ({ value, userId, propertyId }: TProps) => {
  const t = useTranslations("sharing");
  const [optimisticValue, setOptimisticValue] = useState<TPropertyRole>(value);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newRole: TPropertyRole) => {
    if (newRole === optimisticValue) return;
    const prev = optimisticValue;
    setOptimisticValue(newRole);

    startTransition(async () => {
      const result = await changePropertyRole(propertyId, { targetUserId: userId, newRole });

      if (!result.ok) {
        setOptimisticValue(prev);
        const code = errorMessage(result.error);

        if (code === "OWNER_PROTECTED") toast.error(t("errors.OWNER_PROTECTED"));
        else if (code === "LAST_OWNER") toast.error(t("errors.LAST_OWNER"));
        else toast.error(t("toast.roleChangeError"));

        return;
      }

      toast.success(t("toast.roleChangeSuccess"));
    });
  };

  return (
    <Select
      value={optimisticValue}
      onValueChange={(next) => handleChange(next as TPropertyRole)}
      disabled={isPending}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {PROPERTY_ROLE_LIST.map((role) => (
          <SelectItem key={role} value={role}>
            {t(`roles.${role}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
