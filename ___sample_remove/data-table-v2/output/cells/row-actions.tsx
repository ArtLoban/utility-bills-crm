"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Discriminated union for row action items.
 *
 * - `item` (default) — runs a callback via onSelect.
 *   Use for: opening a local dialog, triggering a Server Action, etc.
 *
 * - `link` — renders as <Link> inside DropdownMenuItem (asChild).
 *   Use for: parallel route modals (View, Edit) where the URL must change.
 *   This is how the browser gets a navigable URL for deep linking.
 *
 * - `separator` — visual divider between groups.
 */
export type TRowAction =
  | {
      kind?: "item";
      label: string;
      icon?: ReactNode;
      onSelect: () => void;
      destructive?: boolean;
      disabled?: boolean;
    }
  | {
      kind: "link";
      label: string;
      icon?: ReactNode;
      href: string;
      destructive?: boolean;
      disabled?: boolean;
    }
  | { kind: "separator" };

type TProps = {
  items: TRowAction[];
  triggerLabel: string;
  align?: "start" | "end";
};

export const RowActions = ({ items, triggerLabel, align = "end" }: TProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={triggerLabel}>
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item, idx) => {
          if (item.kind === "separator") {
            return <DropdownMenuSeparator key={`sep-${idx}`} />;
          }

          const iconEl = item.icon ? (
            <span className="mr-2 inline-flex" aria-hidden>
              {item.icon}
            </span>
          ) : null;

          const className = cn(item.destructive && "text-destructive focus:text-destructive");

          if (item.kind === "link") {
            return (
              <DropdownMenuItem
                key={`${item.label}-${idx}`}
                disabled={item.disabled}
                className={className}
                asChild
              >
                <Link href={item.href}>
                  {iconEl}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          }

          // Default: kind === "item"
          return (
            <DropdownMenuItem
              key={`${item.label}-${idx}`}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={className}
            >
              {iconEl}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
