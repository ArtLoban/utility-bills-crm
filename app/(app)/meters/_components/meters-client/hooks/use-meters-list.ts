"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ALL_METERS,
  SERVICE_ORDER,
  type TFilterState,
  type TMeterStatus,
} from "../../../_data/mock";

const FILTER_DEFAULTS: Record<keyof TFilterState, string> = {
  property: "all",
  service: "all",
  status: "active",
};

export const useMetersList = () => {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const filters: TFilterState = {
    property: sp.get("property") ?? "all",
    service: sp.get("service") ?? "all",
    status: (sp.get("status") ?? "active") as TMeterStatus,
  };

  const filteredMeters = useMemo(() => {
    let rows = [...ALL_METERS];

    if (filters.status === "active") rows = rows.filter((m) => m.removedAt === null);
    else if (filters.status === "historical") rows = rows.filter((m) => m.removedAt !== null);

    if (filters.property !== "all") rows = rows.filter((m) => m.property.id === filters.property);
    if (filters.service !== "all") rows = rows.filter((m) => m.serviceKey === filters.service);

    rows.sort((a, b) => {
      const propCmp = a.property.name.localeCompare(b.property.name);
      if (propCmp !== 0) return propCmp;
      const svcCmp = (SERVICE_ORDER[a.serviceKey] ?? 99) - (SERVICE_ORDER[b.serviceKey] ?? 99);
      if (svcCmp !== 0) return svcCmp;
      return b.installedAtMs - a.installedAtMs;
    });

    return rows;
  }, [filters.property, filters.service, filters.status]);

  const totalPages = Math.ceil(filteredMeters.length / perPage);
  const pageRows = filteredMeters.slice((page - 1) * perPage, page * perPage);

  const propertyCount = useMemo(
    () => new Set(filteredMeters.map((m) => m.property.id)).size,
    [filteredMeters],
  );

  const activeCount = useMemo(
    () => filteredMeters.filter((m) => m.removedAt === null).length,
    [filteredMeters],
  );

  const anyFilter =
    filters.property !== "all" || filters.service !== "all" || filters.status !== "active";

  const showHistoricalBadge = filters.status === "all";

  const handleFilterChange = (key: keyof TFilterState, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value === FILTER_DEFAULTS[key]) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setPage(1);
    const qs = params.toString();
    router.push(pathname + (qs ? `?${qs}` : ""));
  };

  const handleClearFilters = () => {
    setPage(1);
    router.push(pathname);
  };

  const handlePerPageChange = (next: number) => {
    setPerPage(next);
    setPage(1);
  };

  return {
    filters,
    filteredMeters,
    anyFilter,
    showHistoricalBadge,
    page,
    setPage,
    perPage,
    totalPages,
    pageRows,
    propertyCount,
    activeCount,
    handleFilterChange,
    handleClearFilters,
    handlePerPageChange,
  };
};
