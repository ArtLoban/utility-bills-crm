"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";

type TPropertyOption = { id: string; name: string };
type TServiceOption = { id: string; name: string };

type TPaymentRecord = {
  id: number;
  paidAt: string;
  property: TPropertyOption;
  service: TServiceOption;
  amount: number;
  notes?: string;
};

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: TPaymentRecord;
  properties: TPropertyOption[];
  services: TServiceOption[];
};

type TFormState = {
  property: string;
  service: string;
  date: string;
  amount: string;
  notes: string;
};

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const todayFormatted = (): string => {
  const d = new Date();
  return `${d.getDate()} ${MONTH_ABBR[d.getMonth()]} ${d.getFullYear()}`;
};

const makeInitialState = (payment?: TPaymentRecord): TFormState => ({
  property: payment?.property.id ?? "",
  service: payment?.service.id ?? "",
  date: payment?.paidAt ?? todayFormatted(),
  amount: payment ? String(payment.amount) : "",
  notes: payment?.notes ?? "",
});

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

const RecordPaymentModal = ({ open, onOpenChange, payment, properties, services }: TProps) => {
  const [form, setForm] = useState<TFormState>(() => makeInitialState(payment));

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setForm(makeInitialState(payment)), 200);
      return () => clearTimeout(timer);
    }
  }, [open, payment]);

  const set = (key: keyof TFormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isEditMode = payment !== undefined;
  const title = isEditMode ? "Edit payment" : "Record payment";
  const canSave = form.property !== "" && form.service !== "" && form.amount !== "";

  const handleSave = () => {
    // devnote: wire to server action when payments table exists
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {title}
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
          {/* Property */}
          <div>
            <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Property
            </label>
            <ModalSelect
              value={form.property}
              isFilled={form.property !== ""}
              onChange={set("property")}
            >
              <option value="" disabled>
                Select property
              </option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </ModalSelect>
          </div>

          {/* Service */}
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
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </ModalSelect>
          </div>

          {/* Date */}
          <div>
            <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Date
            </label>
            <Input
              value={form.date}
              onChange={(e) => set("date")(e.target.value)}
              style={
                form.date !== ""
                  ? { borderColor: TINT_BORDER, background: TINT_BG, fontWeight: 500 }
                  : undefined
              }
              className="h-9"
            />
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
            disabled={!canSave}
            className={
              !canSave ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" : ""
            }
            style={{
              height: 34,
              padding: "0 18px",
              fontSize: 14,
              fontFamily: "inherit",
              border: "none",
              borderRadius: 6,
              cursor: canSave ? "pointer" : "default",
              fontWeight: 500,
              ...(canSave ? { background: ACCENT, color: "#fff" } : {}),
            }}
          >
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { RecordPaymentModal };
export type { TPaymentRecord };
