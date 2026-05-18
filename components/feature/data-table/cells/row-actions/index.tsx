"use client";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { TRowAction } from "./types";
import Link from "next/link";

type TProps = {
  items: TRowAction[];
  triggerLabel?: string;
};

export const RowActions = ({ items, triggerLabel }: TProps) => {
  const t = useTranslations("dataTable.rowActions");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hover:bg-accent data-popup-open:bg-accent inline-flex h-8 w-8 items-center justify-center rounded-md"
        aria-label={triggerLabel ? triggerLabel : t("ariaLabel")}
      >
        <MoreHorizontal size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item, idx) => {
          if (item.kind === "separator") {
            return <DropdownMenuSeparator key={`sep-${idx}`} />;
          }

          // devnote TODO make con color proper when destructive
          const sharedClassName = cn(
            "cursor-pointer",
            item.destructive && "text-destructive focus:text-destructive focus:bg-destructive/10",
          );

          if (item.kind === "link") {
            return (
              <DropdownMenuItem
                key={`${item.label}-${idx}`}
                disabled={item.disabled}
                className={sharedClassName}
                // asChild
              >
                {/* devnote: need to make full width for link */}
                <Link href={item.href}>
                  {item.icon && <span className="mr-2 inline-flex">{item.icon}</span>}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={`${item.label}-${idx}`}
              disabled={item.disabled}
              onClick={item.onSelect}
              className={sharedClassName}
            >
              {item.icon && <span className="mr-2 inline-flex">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
