"use client";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        className="hover:bg-accent data-[state=open]:bg-accent inline-flex h-8 w-8 items-center justify-center rounded-md"
        aria-label={triggerLabel ? triggerLabel : t("ariaLabel")}
      >
        <MoreHorizontal size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item, idx) => {
          if (item.kind === "separator") {
            return <DropdownMenuSeparator key={`sep-${idx}`} />;
          }

          const variant = item.destructive ? "destructive" : "default";

          if (item.kind === "link") {
            return (
              <DropdownMenuItem
                key={`${item.label}-${idx}`}
                asChild
                disabled={item.disabled}
                variant={variant}
                className="cursor-pointer"
              >
                <Link href={item.href}>
                  {item.icon && <span className="mr-1 inline-flex">{item.icon}</span>}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={`${item.label}-${idx}`}
              disabled={item.disabled}
              variant={variant}
              className="cursor-pointer"
              onClick={item.onSelect}
            >
              {item.icon && <span className="mr-1 inline-flex">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
