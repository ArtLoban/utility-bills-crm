"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { changePropertyRole } from "@/features/sharing/actions";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import type { TUserRole } from "../types";

type TProps = { value: TUserRole; userId: string; propertyId: string };

export const RoleDropdown = ({ value, userId, propertyId }: TProps) => {
  const t = useTranslations("sharing");
  const [optimisticValue, setOptimisticValue] = useState<TUserRole>(value);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as TUserRole;
    const prev = optimisticValue;
    setOptimisticValue(newRole);

    startTransition(async () => {
      const result = await changePropertyRole(propertyId as PropertyId, {
        targetUserId: userId,
        newRole: newRole.toLowerCase() as TPropertyRole,
      });

      if (!result.ok) {
        setOptimisticValue(prev);
        toast.error(t("toast.roleChangeError"));
      }
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={optimisticValue}
        onChange={handleChange}
        disabled={isPending}
        className="h-7 cursor-pointer appearance-none rounded-[6px] border border-[#ede9fe] bg-[#f5f3ff] py-0 pr-[26px] pl-[10px] text-xs font-medium text-[#7c3aed] disabled:cursor-default disabled:opacity-60"
      >
        <option value="Owner">Owner</option>
        <option value="Editor">Editor</option>
        <option value="Viewer">Viewer</option>
      </select>
      <ChevronDown size={12} color="#7c3aed" className="pointer-events-none absolute right-[7px]" />
    </div>
  );
};
