"use client";

import { useTranslations } from "next-intl";
import type { TPropertyRole } from "@/lib/db/schema/properties";

type TProps = { role: TPropertyRole };

const ROLE_CLASSES: Record<TPropertyRole, string> = {
  owner: "bg-[var(--role-owner-bg)] border-[var(--role-owner-border)] text-[var(--role-owner-fg)]",
  editor:
    "bg-[var(--role-editor-bg)] border-[var(--role-editor-border)] text-[var(--role-editor-fg)]",
  viewer:
    "bg-[var(--role-viewer-bg)] border-[var(--role-viewer-border)] text-[var(--role-viewer-fg)]",
};

export const RoleBadge = ({ role }: TProps) => {
  const t = useTranslations("sharing");

  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${ROLE_CLASSES[role]}`}>
      {t(`roles.${role}`)}
    </span>
  );
};
