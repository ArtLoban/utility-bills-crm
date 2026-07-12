"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TAction } from "./types";

type TProps = {
  items: TAction[];
  triggerVariant?: "ghost" | "outline";
  triggerLabel?: string;
};

export const ActionsMenu = ({ items, triggerVariant = "ghost", triggerLabel }: TProps) => {
  const t = useTranslations("common.actionsMenu");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size="icon"
          className="data-[state=open]:bg-accent"
          aria-label={triggerLabel ? triggerLabel : t("ariaLabel")}
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
