"use client";

import { useState } from "react";
import { parseAsString, useQueryStates } from "nuqs";

import type { TAdminUserRow } from "@/features/admin-users/types";
import type { TServerPagination } from "@/lib/types/data-table";
import { SYSTEM_ROLES } from "@/lib/auth/constants";

import { UserCard } from "./user-card";
import { MobilePager } from "./mobile-pager";
import { FilterChip } from "./filter-chip";
import { FilterSheet } from "./filter-sheet";

type TProps = {
  data: TAdminUserRow[];
  pagination: TServerPagination;
  onPageChange: (page: number) => void;
};

export const UsersMobile = ({ data, pagination, onPageChange }: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [query, setQuery] = useQueryStates(
    { systemRole: parseAsString, status: parseAsString },
    { history: "replace", shallow: false },
  );

  const activeCount = [query.systemRole, query.status].filter(Boolean).length;

  const roleLabel =
    query.systemRole === SYSTEM_ROLES.ADMIN
      ? "Admin"
      : query.systemRole === SYSTEM_ROLES.USER
        ? "User"
        : null;

  const statusLabel =
    query.status === "deleted" ? "Deleted" : query.status === "all" ? "All users" : null;

  return (
    <div className="px-3.5 pt-3 pb-8">
      <div className={`flex items-center justify-between ${activeCount > 0 ? "mb-2.5" : "mb-3.5"}`}>
        <button
          onClick={() => setSheetOpen(true)}
          className={
            activeCount === 0
              ? "border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              : "border-brand bg-brand-bg text-brand border"
          }
          style={{
            height: 32,
            padding: "0 12px",
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 6,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
        >
          Filters
          {activeCount > 0 && (
            <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        <span className="text-muted-foreground text-xs">
          {pagination.total === 1 ? "1 user" : `${pagination.total} users`}
        </span>
      </div>

      {activeCount > 0 && (
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {roleLabel && (
            <FilterChip label={roleLabel} onRemove={() => void setQuery({ systemRole: null })} />
          )}
          {statusLabel && (
            <FilterChip label={statusLabel} onRemove={() => void setQuery({ status: null })} />
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {data.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <MobilePager
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPrev={() => onPageChange(pagination.page - 1)}
          onNext={() => onPageChange(pagination.page + 1)}
        />
      )}

      <FilterSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};
