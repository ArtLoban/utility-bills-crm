"use client";

import { FilterX, Plus, Receipt } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import {
  ALL_BILLS,
  TBill,
  TFilterState,
  TSortColumn,
  TSortDir,
} from "@/app/(app)/bills/_data/mock";
import { FilterBar } from "./filter-bar";
import { BillsTable } from "./bills-table";
import { BillsFooter } from "./bills-footer";
import { BillsMobile } from "./bills-mobile";
import { AddBillModal } from "./add-bill-modal";

const getSortValue = (bill: TBill, col: TSortColumn): string | number => {
  switch (col) {
    case "date":
      return bill.sortTs;
    case "amount":
      return bill.amount;
    case "property":
      return bill.property.name;
    case "service":
      return bill.service.name;
    case "period":
      return bill.periodSort;
  }
};

const BillsClient = () => {
  const [filters, setFilters] = useState<TFilterState>({
    property: "all",
    service: "all",
    period: "last12",
  });
  const [sortCol, setSortCol] = useState<TSortColumn>("date");
  const [sortDir, setSortDir] = useState<TSortDir>("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const filteredBills = useMemo(() => {
    let rows = [...ALL_BILLS];

    if (filters.property !== "all") rows = rows.filter((r) => r.property.id === filters.property);
    if (filters.service !== "all") rows = rows.filter((r) => r.service.id === filters.service);
    if (filters.period === "last6") rows = rows.filter((r) => r.periodSort >= 202410);
    if (filters.period === "last3") rows = rows.filter((r) => r.periodSort >= 202501);

    rows.sort((a, b) => {
      const av = getSortValue(a, sortCol);
      const bv = getSortValue(b, sortCol);
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

    return rows;
  }, [filters, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredBills.length / perPage);
  const pageRows = filteredBills.slice((page - 1) * perPage, page * perPage);
  const total = filteredBills.reduce((sum, b) => sum + b.amount, 0);
  const anyFilter =
    filters.property !== "all" || filters.service !== "all" || filters.period !== "last12";

  const handleFilterChange = (next: TFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const handleSort = (col: TSortColumn) => {
    setPage(1);
    if (col === sortCol) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  };

  return (
    <div
      style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 32px 48px" }}
      onClick={() => setOpenMenuId(null)}
    >
      {/* Desktop header */}
      <div
        className="hidden md:flex"
        style={{
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, margin: 0 }}>Bills</h2>
          <p style={{ fontSize: 13, color: "#71717a", marginTop: 4 }}>
            {filteredBills.length} records
          </p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setAddBillOpen(true);
          }}
          style={{ height: 34, gap: 6 }}
        >
          <Plus size={14} />
          Add bill
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        {(filteredBills.length > 0 || anyFilter) && (
          <FilterBar filters={filters} onFilterChange={handleFilterChange} anyFilter={anyFilter} />
        )}

        {filteredBills.length === 0 && !anyFilter && (
          <EmptyStateCard
            icon={<Receipt size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title="No bills yet"
            body="Record your first bill to start tracking expenses."
            cta={
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setAddBillOpen(true);
                }}
                style={{ height: 36, gap: 6 }}
              >
                <Plus size={14} />
                Add bill
              </Button>
            }
          />
        )}

        {filteredBills.length === 0 && anyFilter && (
          <EmptyStateCard
            icon={<FilterX size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title="No bills match your filters"
            body="Try adjusting period, property, or service filters."
            cta={
              <Button
                variant="outline"
                onClick={() =>
                  handleFilterChange({ property: "all", service: "all", period: "last12" })
                }
                style={{ height: 36 }}
              >
                Clear filters
              </Button>
            }
          />
        )}

        {filteredBills.length > 0 && (
          <>
            <BillsTable
              rows={pageRows}
              sortCol={sortCol}
              sortDir={sortDir}
              onSort={handleSort}
              openMenuId={openMenuId}
              onMenuOpenChange={setOpenMenuId}
            />
            <BillsFooter
              total={total}
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPageChange={setPage}
              onPerPageChange={(next) => {
                setPerPage(next);
                setPage(1);
              }}
            />
          </>
        )}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden" style={{ margin: "0 -32px" }}>
        <BillsMobile
          filteredBills={filteredBills}
          filters={filters}
          onFilterChange={handleFilterChange}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          total={total}
          pageRows={pageRows}
          onAddBill={() => setAddBillOpen(true)}
        />
      </div>

      <AddBillModal open={addBillOpen} onOpenChange={setAddBillOpen} />
    </div>
  );
};

export { BillsClient };
