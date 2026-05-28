"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import { getServiceLabel } from "@/lib/constants/service-colors";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TBillGlobalRow, TServiceOption } from "@/lib/db/access/bills";
import { MONTH_OPTIONS } from "./constants";
import { useBillForm } from "./hooks/use-bill-form";
import { ModalSelect } from "./components/modal-select";
import { ServiceChip } from "./components/service-chip";

type TProps = {
  bill?: TBillGlobalRow;
  propertyOptions?: { id: PropertyId; name: string }[];
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
};

export const BillFormContent = ({ bill, propertyOptions = [], serviceOptions = {} }: TProps) => {
  const router = useRouter();
  const onClose = () => router.back();

  const {
    form,
    set,
    setProperty,
    availableServices,
    selectedServiceCode,
    canSave,
    isSaving,
    formError,
    handleSave,
    isEditMode,
  } = useBillForm({ bill, propertyOptions, serviceOptions, onClose });

  return (
    <>
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
        }}
      >
        <button
          type="button"
          onClick={onClose}
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
        </button>
        <button
          type="button"
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
    </>
  );
};
