"use client";

import { ChevronDown, Loader2, X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import { createBill, editBill } from "@/features/bills/actions";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceOption } from "@/lib/db/access/bills";
import type { TBillRow } from "@/features/bills/types";
import { toast } from "sonner";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { ServiceChip } from "./service-chip";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyOptions: { id: PropertyId; name: string }[];
  serviceOptions: Record<PropertyId, TServiceOption[]>;
  bill?: TBillRow; // present → edit mode
};

type TFormState = {
  property: string;
  service: string;
  month: string;
  amount: string;
  notes: string;
};

// Generate last 24 calendar months in descending order, format "YYYY-MM".
const generateMonthOptions = (): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  for (let i = 0; i < 24; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const value = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    options.push({ value, label });
  }
  return options;
};

const MONTH_OPTIONS = generateMonthOptions();

const defaultMonth = (): string => MONTH_OPTIONS[0]?.value ?? "";

// Derives "YYYY-MM" from periodSort (YYYYMM number), e.g. 202405 → "2024-05".
const periodSortToMonth = (sort: number): string => {
  const year = Math.floor(sort / 100);
  const month = sort % 100;
  return `${year}-${String(month).padStart(2, "0")}`;
};

type TModalSelectProps = {
  value: string;
  isFilled: boolean;
  onChange: (v: string) => void;
  children: React.ReactNode;
};

const ModalSelect = ({ value, isFilled, onChange, children }: TModalSelectProps) => (
  <div style={{ position: "relative" }}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        !isFilled
          ? `border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${
              value === "" ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-950 dark:text-zinc-50"
            }`
          : ""
      }
      style={{
        appearance: "none",
        width: "100%",
        height: 36,
        paddingLeft: 12,
        paddingRight: 32,
        fontSize: 14,
        borderRadius: 6,
        cursor: "pointer",
        outline: "none",
        fontFamily: "inherit",
        ...(isFilled
          ? {
              border: `1px solid ${TINT_BORDER}`,
              background: TINT_BG,
              color: "#09090b",
              fontWeight: 500,
            }
          : { fontWeight: 400 }),
      }}
    >
      {children}
    </select>
    <ChevronDown
      size={14}
      strokeWidth={2}
      className={!isFilled ? "text-zinc-500 dark:text-zinc-400" : ""}
      style={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        ...(isFilled ? { color: ACCENT } : {}),
      }}
    />
  </div>
);

const buildInitialState = (bill: TBillRow | undefined): TFormState => {
  if (bill) {
    return {
      property: bill.property.id,
      service: bill.serviceId,
      month: periodSortToMonth(bill.periodSort),
      amount: String(bill.amount),
      notes: bill.notes ?? "",
    };
  }
  return { property: "", service: "", month: defaultMonth(), amount: "", notes: "" };
};

const AddBillModal = ({ open, onOpenChange, propertyOptions, serviceOptions, bill }: TProps) => {
  const isEditMode = Boolean(bill);
  const [form, setForm] = useState<TFormState>(() => buildInitialState(bill));
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: keyof TFormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (formError) setFormError(null);
  };

  // Reset property → also reset service when property changes (create mode only)
  const setProperty = (propertyId: string) => {
    setForm((f) => ({ ...f, property: propertyId, service: "" }));
    if (formError) setFormError(null);
  };

  const availableServices: TServiceOption[] = serviceOptions[form.property as PropertyId] ?? [];

  const selectedServiceCode =
    availableServices.find((s) => s.id === form.service)?.typeCode ?? form.service;

  const canSave = form.service !== "" && form.amount !== "" && form.month !== "";

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      if (isEditMode && bill) {
        const result = await editBill(bill.id, {
          month: form.month,
          amount: Number(form.amount),
          notes: form.notes,
        });
        if (!result.ok) {
          if (result.error.name === "ValidationError") {
            setFormError(result.error.message);
          } else {
            toast.error("Failed to save bill. Please try again.");
            onOpenChange(false);
          }
          return;
        }
        toast.success("Bill updated.");
      } else {
        const result = await createBill({
          serviceId: form.service as TServiceId,
          month: form.month,
          amount: Number(form.amount),
          notes: form.notes,
        });
        if (!result.ok) {
          if (result.error.name === "ValidationError") {
            setFormError(result.error.message);
          } else {
            toast.error("Failed to create bill. Please try again.");
            onOpenChange(false);
          }
          return;
        }
        toast.success("Bill added.");
      }
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setForm(buildInitialState(bill));
      setFormError(null);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[480px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[480px]"
      >
        {/* Header */}
        <div
          className="border-b border-zinc-200 dark:border-zinc-800"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
          }}
        >
          <DialogTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {isEditMode ? "Edit Bill" : "Add Bill"}
          </DialogTitle>
          <DialogClose
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <X size={16} className="text-zinc-500 dark:text-zinc-400" />
          </DialogClose>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Property — locked in edit mode */}
          {isEditMode ? (
            <div>
              <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
                Property
              </label>
              <p
                className="text-zinc-950 dark:text-zinc-50"
                style={{
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  paddingLeft: 12,
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: "var(--border)",
                  background: "var(--muted)",
                }}
              >
                {bill?.property.name}
              </p>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
                Property
              </label>
              <ModalSelect
                value={form.property}
                isFilled={form.property !== ""}
                onChange={setProperty}
              >
                <option value="" disabled>
                  Select property
                </option>
                {propertyOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </ModalSelect>
            </div>
          )}

          {/* Service — locked in edit mode */}
          {isEditMode ? (
            <div>
              <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
                Service
              </label>
              <p
                className="text-zinc-950 dark:text-zinc-50"
                style={{
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  paddingLeft: 12,
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: "var(--border)",
                  background: "var(--muted)",
                }}
              >
                <ServiceChip serviceId={selectedServiceCode} />
              </p>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
                Service
              </label>
              <ModalSelect
                value={form.service}
                isFilled={form.service !== ""}
                onChange={set("service")}
              >
                <option value="" disabled>
                  Select service
                </option>
                {availableServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {getServiceLabel(s.typeCode)}
                  </option>
                ))}
              </ModalSelect>
              {form.property === "" && (
                <p
                  className="text-zinc-500 dark:text-zinc-400"
                  style={{ fontSize: 12.5, marginTop: 6 }}
                >
                  Select a property first
                </p>
              )}
              {form.service !== "" && (
                <div
                  className="text-zinc-500 dark:text-zinc-400"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 6,
                    fontSize: 12.5,
                  }}
                >
                  Selected: <ServiceChip serviceId={selectedServiceCode} />
                </div>
              )}
            </div>
          )}

          {/* Month */}
          <div>
            <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Month
            </label>
            <ModalSelect value={form.month} isFilled={false} onChange={set("month")}>
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </ModalSelect>
          </div>

          {/* Amount */}
          <div>
            <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Amount
            </label>
            <Input
              value={form.amount}
              onChange={(e) => set("amount")(e.target.value)}
              placeholder="e.g. 680"
              type="number"
              min={0}
              style={
                form.amount !== ""
                  ? { borderColor: TINT_BORDER, background: TINT_BG, fontWeight: 500 }
                  : undefined
              }
              className="h-9"
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Notes{" "}
              <span className="text-zinc-500 dark:text-zinc-400" style={{ fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Any remarks…"
              rows={3}
            />
          </div>

          {formError && <p className="text-destructive -mt-2 text-sm">{formError}</p>}
        </div>

        {/* Footer */}
        <div
          className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DialogClose
            className="border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{
              height: 34,
              padding: "0 16px",
              fontSize: 14,
              fontFamily: "inherit",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className={
              !canSave || isSaving
                ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                : ""
            }
            style={{
              height: 34,
              padding: "0 18px",
              fontSize: 14,
              fontFamily: "inherit",
              border: "none",
              borderRadius: 6,
              cursor: canSave && !isSaving ? "pointer" : "default",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              ...(canSave && !isSaving ? { background: ACCENT, color: "#fff" } : {}),
            }}
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            {isSaving ? "Saving…" : isEditMode ? "Save changes" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddBillModal };
