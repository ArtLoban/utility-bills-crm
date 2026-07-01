"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Globe, Pencil, Phone, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Surface } from "@/components/surface";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { TProviderWithUsage } from "@/app/(app)/providers/_data/queries";
import { useProvidersList } from "../context";

// ── Monogram color palette ────────────────────────────────────────────────────
// Maps provider IDs (UUIDs) to one of 6 semantic CSS variable colors.
// Same djb2-variant hash as getAvatarColor in components/app-nav/utils/avatar-color.ts.
const MONOGRAM_PALETTE = [
  "var(--amber-500)",
  "var(--red-500)",
  "var(--blue-500)",
  "var(--pink-500)",
  "var(--violet-500)",
  "var(--teal-500)",
] as const;

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const getMonogramColor = (id: string): string =>
  MONOGRAM_PALETTE[hashString(id) % MONOGRAM_PALETTE.length]!;

// ─────────────────────────────────────────────────────────────────────────────

type TProps = {
  provider: TProviderWithUsage;
};

export const ProviderCard = ({ provider }: TProps) => {
  const t = useTranslations("providers");
  const { requestDelete } = useProvidersList();

  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const noteRef = useRef<HTMLParagraphElement>(null);

  const canDelete = provider.usageCount === 0;
  const color = getMonogramColor(provider.id);

  // Detect whether the note text exceeds 3 lines after first render.
  // The check runs once on mount; notes content doesn't change while the card is mounted.
  useEffect(() => {
    const el = noteRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      setOverflows(el.scrollHeight > el.clientHeight + 2);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Surface elevation="sm" className="flex items-start gap-4 px-5 py-[18px]">
      {/* Monogram */}
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-xl text-[17px] leading-none font-semibold tracking-[-0.3px] select-none"
        style={{ color, background: `color-mix(in oklch, ${color} 13%, transparent)` }}
        aria-hidden="true"
      >
        {provider.name[0]}
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Name */}
        <p className="mb-[5px] text-[15px] leading-tight font-semibold tracking-[-0.2px]">
          {provider.name}
        </p>

        {/* Contact line */}
        {(provider.phone || provider.website) && (
          <div className="mb-[5px] flex flex-wrap items-center gap-x-4 gap-y-1">
            {provider.phone && (
              <span className="text-muted-foreground inline-flex items-center gap-[5px] text-[13px] leading-none whitespace-nowrap">
                <Phone size={12} />
                {provider.phone}
              </span>
            )}
            {provider.website && (
              <a
                href={`https://${provider.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-[5px] text-[13px] leading-none whitespace-nowrap hover:underline"
              >
                <Globe size={12} />
                {provider.website}
              </a>
            )}
          </div>
        )}

        {/* Usage indicator */}
        <p
          className={cn(
            "text-muted-foreground text-[12.5px] leading-none",
            provider.notes && "mb-[9px]",
          )}
        >
          {provider.usageCount > 0
            ? t("usage.used", { count: provider.usageCount })
            : t("usage.notInUse")}
        </p>

        {/* Notes */}
        {provider.notes && (
          <div>
            <p
              ref={noteRef}
              className={cn(
                "text-muted-foreground m-0 text-[13px] leading-[1.55]",
                !expanded && "line-clamp-3",
              )}
            >
              {provider.notes}
            </p>
            {overflows && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-primary mt-[5px] cursor-pointer bg-transparent p-0 text-[12.5px] leading-none font-medium hover:underline"
              >
                {expanded ? t("notes.showLess") : t("notes.showMore")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5 pt-px">
        {/* Edit */}
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <Link href={`${ROUTES.providers}/${provider.id}/edit`} aria-label={t("actions.edit")}>
            <Pencil size={14} />
          </Link>
        </Button>

        {/* Delete — destructive when free, disabled+tooltip when in use */}
        {canDelete ? (
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive h-8 w-8"
            onClick={() => requestDelete(provider)}
            aria-label={t("actions.delete")}
          >
            <Trash2 size={14} />
          </Button>
        ) : (
          <Tooltip>
            {/* span wrapper required: disabled buttons don't receive pointer events */}
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled
                  aria-label={t("actions.delete")}
                >
                  <Trash2 size={14} />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">{t("delete.inUseTooltip")}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </Surface>
  );
};
