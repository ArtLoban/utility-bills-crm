"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { TAdminPropertyRow } from "@/features/admin-properties";

import { usePropertiesTable } from "../context";

type TProps = { row: TAdminPropertyRow };

const formatOwners = (owners: TAdminPropertyRow["owners"]): string => {
  const primary = owners[0];
  if (!primary) return "—";
  return owners.length === 1
    ? (primary.name ?? primary.email)
    : `${primary.name ?? primary.email} (+${owners.length - 1})`;
};

export const PropertyCard = ({ row }: TProps) => {
  const t = useTranslations("adminProperties");
  const { openRestore, openHardDelete } = usePropertiesTable();
  const isDeleted = row.deletedAt !== null;

  return (
    <div
      className={`rounded-lg border border-zinc-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none ${isDeleted ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/art-admin/properties/${row.id}`}
          className={`truncate text-sm font-semibold tracking-tight hover:underline ${isDeleted ? "line-through" : ""}`}
        >
          {row.name}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-transparent data-[state=open]:border-zinc-200 data-[state=open]:bg-zinc-100 dark:data-[state=open]:border-zinc-700 dark:data-[state=open]:bg-zinc-800">
            <MoreHorizontal
              size={15}
              strokeWidth={1.75}
              className="text-zinc-950 dark:text-zinc-50"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={`/art-admin/properties/${row.id}`}>{t("rowActions.viewDetails")}</Link>
            </DropdownMenuItem>
            {!isDeleted && (
              <DropdownMenuItem asChild>
                <Link href={`/properties/${row.id}`}>{t("rowActions.goToProperty")}</Link>
              </DropdownMenuItem>
            )}
            {isDeleted && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openRestore(row)}>
                  {t("rowActions.restore")}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => openHardDelete(row)}>
                  {t("rowActions.hardDelete")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-0.5 text-[12.5px] text-zinc-500 dark:text-zinc-400">
        {formatOwners(row.owners)}
      </p>
      <p className="mt-0.5 text-xs text-zinc-400 tabular-nums dark:text-zinc-600">
        {row.type} · {row.servicesCount} {row.servicesCount === 1 ? "service" : "services"} ·{" "}
        {row.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
      </p>

      {isDeleted && (
        <div className="mt-2">
          <Badge
            variant="outline"
            className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
          >
            {t("status.deleted")}
          </Badge>
        </div>
      )}
    </div>
  );
};
