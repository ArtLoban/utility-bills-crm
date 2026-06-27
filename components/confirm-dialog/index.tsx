"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { IconBadge } from "@/components/icon-badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TONE_ICON_COLOR, TONE_VARIANT } from "./constants";
import type { TProps } from "./types";

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  tone = "destructive",
  icon,
  entityPreview,
  description,
  secondaryText,
  warningText,
  children,
  requireType,
  confirmLabel,
  confirmIcon,
  cancelLabel,
  isPending = false,
  onConfirm,
}: TProps) => {
  const t = useTranslations("common");
  const [typed, setTyped] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) setTyped("");
  };

  const typeMatched = !requireType || typed === requireType;

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      variant={TONE_VARIANT[tone]}
      confirmLabel={confirmLabel}
      confirmIcon={confirmIcon}
      cancelLabel={cancelLabel}
      canSave={typeMatched}
      isSaving={isPending}
      onConfirm={onConfirm}
    >
      <div className="py-2">
        <div className="mb-5 flex justify-center">
          <IconBadge icon={icon} color={TONE_ICON_COLOR[tone]} size="xl" border />
        </div>

        {entityPreview && (
          <div className="bg-muted mb-4 flex items-center gap-3 rounded-lg border px-3.5 py-3">
            {entityPreview}
          </div>
        )}

        <p className="text-center text-sm leading-relaxed">{description}</p>

        {secondaryText && (
          <p className="text-muted-foreground mt-2.5 text-center text-sm leading-relaxed">
            {secondaryText}
          </p>
        )}

        {warningText && (
          <p className="text-destructive mt-3 text-center text-sm leading-snug font-semibold">
            {warningText}
          </p>
        )}

        {children}

        {requireType && (
          <>
            <div className="bg-border my-4 h-px" />
            <label className="mb-2 block text-sm">
              {t.rich("confirm.typeToConfirm", {
                token: requireType,
                code: (chunks) => (
                  <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">{chunks}</code>
                ),
              })}
            </label>
            <div className="relative">
              <Input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                className={cn(
                  "font-mono font-semibold tracking-wider",
                  typeMatched &&
                    typed &&
                    "border-success focus-visible:border-success focus-visible:ring-success/20 pr-8",
                )}
              />
              {typeMatched && typed && (
                <Check
                  size={14}
                  className="text-success pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2"
                />
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
