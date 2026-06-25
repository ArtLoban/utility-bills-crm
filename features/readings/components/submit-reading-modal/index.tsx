"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCENT, SUCCESS, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { useReadingForm } from "./hooks/use-reading-form";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  lastReading: TReading | null;
  reading?: TReading;
};

const getValueInputStyle = (filled: boolean, warning: boolean): React.CSSProperties => {
  if (!filled) return {};
  if (warning) return { fontWeight: 500, borderColor: "#d97706", background: "#fffbeb" };
  return { fontWeight: 500, borderColor: TINT_BORDER, background: TINT_BG };
};

const HintText = ({
  children,
  warning = false,
}: {
  children: React.ReactNode;
  warning?: boolean;
}) => (
  <div
    className={!warning ? "text-zinc-500 dark:text-zinc-400" : undefined}
    style={{
      marginTop: 6,
      fontSize: 12.5,
      display: "flex",
      alignItems: "flex-start",
      gap: 6,
      lineHeight: 1.4,
      ...(warning ? { color: "#d97706" } : {}),
    }}
  >
    {warning && <AlertTriangle size={13} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />}
    <span>{children}</span>
  </div>
);

const SubmitReadingModal = ({
  open,
  onOpenChange,
  meter,
  serviceType,
  propertyName,
  lastReading,
  reading,
}: TProps) => {
  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);

  const {
    form,
    set,
    formError,
    handleSave,
    isSaving,
    canSave,
    isEditMode,
    warningFlags,
    hasAnyWarning,
    lastT1,
    lastT2,
    lastT3,
    lastReadingDate,
    resetForm,
  } = useReadingForm({ meter, reading, lastReading, onClose: () => onOpenChange(false) });

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(resetForm, 200);
      return () => clearTimeout(timer);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const title = isEditMode ? "Edit reading" : "Submit reading";

  const submitLabel = hasAnyWarning
    ? isEditMode
      ? "Save anyway"
      : "Submit anyway"
    : isEditMode
      ? "Save"
      : "Submit";

  const zoneLabel = (zone: "T1" | "T2" | "T3"): string => {
    if (meter.zoneCount === 1) return `Value (${serviceType.unit ?? "units"})`;
    const zoneSuffix: Record<string, string> = { T1: "day", T2: "night", T3: "peak" };
    return `Value ${zone} — ${zoneSuffix[zone]} (${serviceType.unit ?? "units"})`;
  };

  const t1Value = parseFloat(form.valueT1.replace(/,/g, ""));
  const t2Value = parseFloat(form.valueT2.replace(/,/g, ""));
  const t3Value = parseFloat(form.valueT3.replace(/,/g, ""));

  const t1Filled = !isNaN(t1Value) && form.valueT1 !== "";
  const t2Filled = !isNaN(t2Value) && form.valueT2 !== "";
  const t3Filled = !isNaN(t3Value) && form.valueT3 !== "";

  const deltaStr = (delta: number): string =>
    `Δ ${delta >= 0 ? "+" : ""}${delta.toLocaleString("en-US", { maximumFractionDigits: 3 })}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[480px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[480px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <DialogTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {title}
          </DialogTitle>
          <DialogClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
            <X size={16} className="text-zinc-500 dark:text-zinc-400" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Meter context */}
          <div className="mb-5 flex items-center gap-3 rounded-lg bg-zinc-100 px-3.5 py-3 dark:bg-zinc-800">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: color + "1A" }}
            >
              <Icon size={18} style={{ color }} strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[-0.1px] text-zinc-950 dark:text-zinc-50">
                {serviceType.code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} meter
                {meter.serialNumber && (
                  <span className="font-normal"> · SN {meter.serialNumber}</span>
                )}
                {meter.zoneCount > 1 && (
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">
                    {" "}
                    · {meter.zoneCount} zones
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{propertyName}</div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Date field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Reading date</label>
              <Input
                type="date"
                value={form.readAt}
                onChange={(e) => set("readAt")(e.target.value)}
                className="h-9"
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>

            {/* Value field(s) */}
            {meter.zoneCount === 1 ? (
              <div>
                <label className="mb-1.5 block text-sm font-medium">{zoneLabel("T1")}</label>
                <Input
                  value={form.valueT1}
                  onChange={(e) => set("valueT1")(e.target.value)}
                  placeholder="e.g. 12650"
                  className="h-9"
                  style={getValueInputStyle(t1Filled, warningFlags.t1)}
                />
                {warningFlags.t1 ? (
                  <HintText warning>
                    This value is lower than the last reading (
                    {lastT1?.toLocaleString("en-US", { maximumFractionDigits: 3 })}). Correct?
                    (meter replacement, rollover, or input error)
                  </HintText>
                ) : (
                  <HintText>
                    {lastReadingDate && lastT1 !== null ? (
                      <>
                        Last reading was{" "}
                        {lastT1?.toLocaleString("en-US", { maximumFractionDigits: 3 })} on{" "}
                        {lastReadingDate}
                        {t1Filled && !warningFlags.t1 && (
                          <span style={{ color: SUCCESS, fontWeight: 500 }}>
                            {" · "}
                            {deltaStr(t1Value - (lastT1 ?? 0))} {serviceType.unit}
                          </span>
                        )}
                      </>
                    ) : (
                      "No previous readings"
                    )}
                  </HintText>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: meter.zoneCount === 3 ? "1fr 1fr 1fr" : "1fr 1fr",
                  gap: 14,
                }}
              >
                {/* T1 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{zoneLabel("T1")}</label>
                  <Input
                    value={form.valueT1}
                    onChange={(e) => set("valueT1")(e.target.value)}
                    placeholder="e.g. 8210"
                    className="h-9"
                    style={getValueInputStyle(t1Filled, warningFlags.t1)}
                  />
                  {warningFlags.t1 ? (
                    <HintText warning>
                      Lower than last (
                      {lastT1?.toLocaleString("en-US", { maximumFractionDigits: 3 })}). Correct?
                    </HintText>
                  ) : (
                    <HintText>
                      {lastReadingDate && lastT1 !== null ? (
                        <>
                          Last: {lastT1?.toLocaleString("en-US", { maximumFractionDigits: 3 })} ·{" "}
                          {lastReadingDate}
                          {t1Filled && !warningFlags.t1 && (
                            <span style={{ color: SUCCESS, fontWeight: 500 }}>
                              {" · "}
                              {deltaStr(t1Value - (lastT1 ?? 0))}
                            </span>
                          )}
                        </>
                      ) : (
                        "No previous readings"
                      )}
                    </HintText>
                  )}
                </div>

                {/* T2 */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{zoneLabel("T2")}</label>
                  <Input
                    value={form.valueT2}
                    onChange={(e) => set("valueT2")(e.target.value)}
                    placeholder="e.g. 4620"
                    className="h-9"
                    style={getValueInputStyle(t2Filled, warningFlags.t2)}
                  />
                  {warningFlags.t2 ? (
                    <HintText warning>
                      Lower than last (
                      {lastT2?.toLocaleString("en-US", { maximumFractionDigits: 3 })}). Correct?
                    </HintText>
                  ) : (
                    <HintText>
                      {lastReadingDate && lastT2 !== null ? (
                        <>
                          Last: {lastT2?.toLocaleString("en-US", { maximumFractionDigits: 3 })} ·{" "}
                          {lastReadingDate}
                          {t2Filled && !warningFlags.t2 && (
                            <span style={{ color: SUCCESS, fontWeight: 500 }}>
                              {" · "}
                              {deltaStr(t2Value - (lastT2 ?? 0))}
                            </span>
                          )}
                        </>
                      ) : (
                        "No previous readings"
                      )}
                    </HintText>
                  )}
                </div>

                {/* T3 (three-zone meters only) */}
                {meter.zoneCount === 3 && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{zoneLabel("T3")}</label>
                    <Input
                      value={form.valueT3}
                      onChange={(e) => set("valueT3")(e.target.value)}
                      placeholder="e.g. 2100"
                      className="h-9"
                      style={getValueInputStyle(t3Filled, warningFlags.t3)}
                    />
                    {warningFlags.t3 ? (
                      <HintText warning>
                        Lower than last (
                        {lastT3?.toLocaleString("en-US", { maximumFractionDigits: 3 })}). Correct?
                      </HintText>
                    ) : (
                      <HintText>
                        {lastReadingDate && lastT3 !== null ? (
                          <>
                            Last: {lastT3?.toLocaleString("en-US", { maximumFractionDigits: 3 })} ·{" "}
                            {lastReadingDate}
                            {t3Filled && !warningFlags.t3 && (
                              <span style={{ color: SUCCESS, fontWeight: 500 }}>
                                {" · "}
                                {deltaStr(t3Value - (lastT3 ?? 0))}
                              </span>
                            )}
                          </>
                        ) : (
                          "No previous readings"
                        )}
                      </HintText>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Notes{" "}
                <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
              </label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                placeholder="Any remarks about this reading…"
                rows={2}
              />
            </div>

            {/* Inline form error */}
            {formError && (
              <p className="text-sm" style={{ color: "#dc2626" }}>
                {formError}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3.5 dark:border-zinc-800 dark:bg-zinc-800/50"
          style={{ borderRadius: "0 0 10px 10px" }}
        >
          <DialogClose
            className="cursor-pointer rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 34 }}
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="cursor-pointer rounded-md border-0 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{ height: 34, padding: "0 18px", background: ACCENT }}
          >
            {isSaving ? "Saving…" : submitLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SubmitReadingModal };
