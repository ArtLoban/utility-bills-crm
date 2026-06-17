"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOverflowNav } from "./hooks/use-overflow-nav";
import type { TOverflowNavProps } from "./types";

const TRIGGER_BASE =
  "text-muted-foreground hover:text-foreground inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm transition-colors outline-none";

export const OverflowNav = ({
  items,
  renderInline,
  renderMenuItem,
  moreLabel,
  triggerAccentClassName,
  className,
}: TOverflowNavProps) => {
  const { containerRef, measureRef, visibleCount } = useOverflowNav(items);

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);
  const hasActiveOverflow = overflowItems.some((item) => item.active);

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1 overflow-hidden">
      <div className={cn("hidden items-center gap-6 md:flex", className)}>
        {visibleItems.map((item) => (
          <span key={item.href} className="shrink-0">
            {renderInline(item)}
          </span>
        ))}

        {overflowItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(TRIGGER_BASE, hasActiveOverflow && triggerAccentClassName)}
            >
              {moreLabel}
              <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {overflowItems.map((item) => renderMenuItem(item))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 flex items-center gap-6"
      >
        {items.map((item) => (
          <span key={item.href} data-overflow-item className="shrink-0">
            {renderInline(item)}
          </span>
        ))}
        <span data-overflow-more className={TRIGGER_BASE}>
          {moreLabel}
          <ChevronDown className="size-4" />
        </span>
      </div>
    </div>
  );
};
