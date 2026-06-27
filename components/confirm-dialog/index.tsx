"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TONE_CONFIG } from "./constants";
import type { TProps } from "./types";

// TODO: refactor (LATER!)
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
  confirmLabel = "Confirm",
  confirmIcon,
  cancelLabel = "Cancel",
  closeButton = true,
  isPending = false,
  onConfirm,
}: TProps) => {
  const [typed, setTyped] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) setTyped("");
  };

  const toneConfig = TONE_CONFIG[tone];
  const isCentered = !!icon;
  const typeMatched = !requireType || typed === requireType;
  const canConfirm = typeMatched && !isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-[460px] gap-0 overflow-hidden rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[460px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <DialogTitle className="text-md font-semibold tracking-[-0.2px]">{title}</DialogTitle>
          {closeButton && (
            <button
              type="button"
              aria-label="Close"
              onClick={() => handleOpenChange(false)}
              className="hover:bg-muted flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent p-0 transition-colors"
            >
              <X size={15} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {icon && (
            <div className="mb-5 flex justify-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-[14px]"
                style={{
                  background: toneConfig.iconBg,
                  border: `1px solid ${toneConfig.iconBorder}`,
                  color: toneConfig.iconColor,
                }}
              >
                {icon}
              </div>
            </div>
          )}

          {entityPreview && (
            <div className="bg-muted mb-4 flex items-center gap-3 rounded-lg border px-[14px] py-3">
              {entityPreview}
            </div>
          )}

          {description && (
            <p className={cn("text-sm leading-[1.55]", isCentered && "text-center")}>
              {description}
            </p>
          )}

          {secondaryText && (
            <p
              className={cn(
                "text-muted-foreground mt-[10px] text-[13.5px] leading-[1.55]",
                isCentered && "text-center",
              )}
            >
              {secondaryText}
            </p>
          )}

          {warningText && (
            <p
              className={cn(
                "text-destructive mt-3 text-[13.5px] leading-snug font-semibold",
                isCentered && "text-center",
              )}
            >
              {warningText}
            </p>
          )}

          {children}

          {requireType && (
            <>
              <div className="bg-border my-4 h-px" />
              <label className="mb-2 block text-[13.5px]">
                To confirm, type{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-[12.5px]">
                  {requireType}
                </code>{" "}
                below.
              </label>
              <div className="relative">
                <Input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  className={cn(
                    "font-mono font-semibold tracking-[0.08em]",
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

        {/* Footer */}
        <div
          className={cn(
            "bg-muted/50 flex items-center border-t px-6 py-3.5",
            cancelLabel ? "justify-between" : "justify-end",
          )}
        >
          {cancelLabel && (
            <Button
              type="button"
              variant="outline"
              className="h-[34px]"
              onClick={() => handleOpenChange(false)}
            >
              {cancelLabel}
            </Button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="inline-flex h-[34px] items-center gap-1.5 rounded-[6px] border-0 px-4 text-[13.5px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: toneConfig.confirmBg }}
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : confirmIcon}
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
