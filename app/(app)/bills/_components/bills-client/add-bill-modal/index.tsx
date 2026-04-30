import { AlertTriangle, ChevronDown, X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TServiceKey } from "@/lib/constants/service-colors";
import { ACCENT, BORDER, MUTED_FG, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import { BILL_PROPERTIES, BILL_SERVICES } from "@/app/(app)/bills/_data/mock";
import { ServiceChip } from "./service-chip";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TFormState = {
  property: string;
  service: string;
  month: string;
  amount: string;
  notes: string;
};

const INITIAL_STATE: TFormState = {
  property: "",
  service: "",
  month: "apr2026",
  amount: "",
  notes: "",
};

const MONTH_OPTIONS = [
  { value: "apr2026", label: "April 2026" },
  { value: "mar2026", label: "March 2026" },
  { value: "feb2026", label: "February 2026" },
  { value: "jan2026", label: "January 2026" },
  { value: "dec2025", label: "December 2025" },
  { value: "nov2025", label: "November 2025" },
  { value: "custom", label: "Custom month…" },
];

const MOCK_EXPECTED = 432;

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
      style={{
        appearance: "none",
        width: "100%",
        height: 36,
        paddingLeft: 12,
        paddingRight: 32,
        fontSize: 14,
        borderRadius: 6,
        border: `1px solid ${isFilled ? TINT_BORDER : BORDER}`,
        background: isFilled ? TINT_BG : "#fff",
        color: isFilled ? "#09090b" : value === "" ? MUTED_FG : "#09090b",
        fontWeight: isFilled ? 500 : 400,
        cursor: "pointer",
        outline: "none",
        fontFamily: "inherit",
      }}
    >
      {children}
    </select>
    <ChevronDown
      size={14}
      strokeWidth={2}
      style={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color: isFilled ? ACCENT : MUTED_FG,
      }}
    />
  </div>
);

const AddBillModal = ({ open, onOpenChange }: TProps) => {
  const [form, setForm] = useState<TFormState>(INITIAL_STATE);

  const set = (key: keyof TFormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isServiceKey = (v: string): v is TServiceKey => BILL_SERVICES.some((s) => s.id === v);

  const showTariffHint = form.service === "electricity" && form.amount !== "";
  const amountNum = Number(form.amount);
  const showWarning = showTariffHint && amountNum > MOCK_EXPECTED * 1.5;
  const overPct = showWarning ? Math.round((amountNum / MOCK_EXPECTED - 1) * 100) : 0;

  const canSave = form.property !== "" && form.service !== "" && form.amount !== "";

  const handleSave = () => {
    // devnote: wire to POST /api/bills when API routes exist
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setForm(INITIAL_STATE);
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <DialogTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            Add bill
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
            <X size={16} color={MUTED_FG} />
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
              {BILL_PROPERTIES.map((p) => (
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
              {BILL_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </ModalSelect>
            {form.service === "" && (
              <p style={{ fontSize: 12.5, color: MUTED_FG, marginTop: 6 }}>
                Filtered by selected property
              </p>
            )}
            {form.service !== "" && isServiceKey(form.service) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 6,
                  fontSize: 12.5,
                  color: MUTED_FG,
                }}
              >
                Selected: <ServiceChip serviceId={form.service} />
              </div>
            )}
          </div>

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
            {showTariffHint && (
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12.5,
                    color: MUTED_FG,
                  }}
                >
                  Expected based on your tariff:
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      background: "#f4f4f5",
                      padding: "1px 7px",
                      borderRadius: 4,
                      fontFeatureSettings: '"tnum" 1',
                    }}
                  >
                    {MOCK_EXPECTED} UAH
                  </span>
                </div>
                {showWarning && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 6,
                      fontSize: 12.5,
                      color: "#d97706",
                    }}
                  >
                    <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                    Amount is {overPct}% higher than expected — double-check before saving.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Notes <span style={{ fontWeight: 400, color: MUTED_FG }}>(optional)</span>
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderTop: `1px solid ${BORDER}`,
            background: "#fafafa",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DialogClose
            style={{
              height: 34,
              padding: "0 16px",
              fontSize: 14,
              fontFamily: "inherit",
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              cursor: "pointer",
              color: "#09090b",
            }}
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              height: 34,
              padding: "0 18px",
              fontSize: 14,
              fontFamily: "inherit",
              background: canSave ? ACCENT : "#e4e4e7",
              color: canSave ? "#fff" : MUTED_FG,
              border: "none",
              borderRadius: 6,
              cursor: canSave ? "pointer" : "default",
              fontWeight: 500,
            }}
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddBillModal };
