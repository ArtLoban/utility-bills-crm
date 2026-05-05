"use client";

import { useEffect, useState } from "react";
import { Calendar, X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCENT, SUCCESS, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import { HintText } from "./components/hint-text";
import { MeterContext } from "./components/meter-context";
import type { TMeter, TReadingFormState, TReadingResult } from "./types";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meter: TMeter;
  onSubmit?: (result: TReadingResult) => void;
};

const makeInitialState = (): TReadingFormState => ({
  date: new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  value: "",
  valueT1: "",
  valueT2: "",
  notes: "",
});

const getValueInputStyle = (filled: boolean, warning: boolean): React.CSSProperties => {
  if (!filled) return {};
  if (warning) return { fontWeight: 500, borderColor: "#d97706", background: "#fffbeb" };
  return { fontWeight: 500, borderColor: TINT_BORDER, background: TINT_BG };
};

const ReadingModal = ({ open, onOpenChange, meter, onSubmit }: TProps) => {
  const [formState, setFormState] = useState<TReadingFormState>(makeInitialState);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setFormState(makeInitialState()), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const set = (key: keyof TReadingFormState) => (value: string) =>
    setFormState((f) => ({ ...f, [key]: value }));

  // Single-zone derived state
  const parsedValue = parseFloat(formState.value.replace(/,/g, ""));
  const isFilled = !isNaN(parsedValue) && formState.value !== "";
  const isWarning = isFilled && parsedValue < meter.lastReadingValue;
  const isValid = isFilled && !isWarning;
  const delta = isFilled ? parsedValue - meter.lastReadingValue : 0;

  // Two-zone derived state
  const parsedT1 = parseFloat(formState.valueT1.replace(/,/g, ""));
  const parsedT2 = parseFloat(formState.valueT2.replace(/,/g, ""));
  const t1Filled = !isNaN(parsedT1) && formState.valueT1 !== "";
  const t2Filled = !isNaN(parsedT2) && formState.valueT2 !== "";
  const t1Warning = t1Filled && parsedT1 < (meter.lastReadingT1 ?? 0);
  const t2Warning = t2Filled && parsedT2 < (meter.lastReadingT2 ?? 0);
  const anyWarning = t1Warning || t2Warning;
  const t1Delta = t1Filled ? parsedT1 - (meter.lastReadingT1 ?? 0) : 0;
  const t2Delta = t2Filled ? parsedT2 - (meter.lastReadingT2 ?? 0) : 0;

  const submitLabel =
    meter.zones === 1
      ? isWarning
        ? "Submit anyway"
        : "Submit"
      : anyWarning
        ? "Submit anyway"
        : "Submit";

  const handleSubmit = () => {
    if (onSubmit) {
      const result: TReadingResult = { date: formState.date, notes: formState.notes };
      if (meter.zones === 1 && isFilled) {
        result.value = parsedValue;
      } else if (meter.zones === 2) {
        if (t1Filled) result.valueT1 = parsedT1;
        if (t2Filled) result.valueT2 = parsedT2;
      }
      onSubmit(result);
    }
    // devnote: wire to POST API when reading submission endpoint is ready
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[480px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[480px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <DialogTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            Submit reading
          </DialogTitle>
          <DialogClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
            <X size={16} className="text-zinc-500 dark:text-zinc-400" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <MeterContext meter={meter} />

          <div className="flex flex-col gap-4">
            {/* Date field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Reading date</label>
              <div className="relative">
                {/* devnote: replace with date picker in a later iteration */}
                <Input
                  value={formState.date}
                  readOnly
                  className="h-9 bg-zinc-50 pr-8 dark:bg-zinc-900"
                />
                <Calendar
                  size={15}
                  className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                />
              </div>
            </div>

            {/* Value field(s) */}
            {meter.zones === 1 ? (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Value ({meter.unit})</label>
                <Input
                  value={formState.value}
                  onChange={(e) => set("value")(e.target.value)}
                  placeholder="e.g. 12,650"
                  autoFocus
                  className="h-9"
                  style={getValueInputStyle(isFilled, isWarning)}
                />
                {isWarning ? (
                  <HintText warning>
                    This value is lower than the last reading (
                    {meter.lastReadingValue.toLocaleString()}). Is this correct? (replacement, input
                    error, or rollover)
                  </HintText>
                ) : (
                  <HintText>
                    Last reading was {meter.lastReadingValue.toLocaleString()} on{" "}
                    {meter.lastReadingDate}
                    {isValid && (
                      <span style={{ color: SUCCESS, fontWeight: 500 }}>
                        {" · Δ +"}
                        {delta.toLocaleString()} {meter.unit}
                      </span>
                    )}
                  </HintText>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* T1 — day */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Value T1 — day ({meter.unit})
                  </label>
                  <Input
                    value={formState.valueT1}
                    onChange={(e) => set("valueT1")(e.target.value)}
                    placeholder="e.g. 8,210"
                    autoFocus
                    className="h-9"
                    style={getValueInputStyle(t1Filled, t1Warning)}
                  />
                  {t1Warning ? (
                    <HintText warning>
                      Lower than last reading ({(meter.lastReadingT1 ?? 0).toLocaleString()}).
                      Correct?
                    </HintText>
                  ) : (
                    <HintText>
                      Last: {(meter.lastReadingT1 ?? 0).toLocaleString()} {meter.unit} ·{" "}
                      {meter.lastReadingDate}
                      {t1Filled && !t1Warning && (
                        <span style={{ color: SUCCESS, fontWeight: 500 }}>
                          {" · Δ +"}
                          {t1Delta.toLocaleString()}
                        </span>
                      )}
                    </HintText>
                  )}
                </div>

                {/* T2 — night */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Value T2 — night ({meter.unit})
                  </label>
                  <Input
                    value={formState.valueT2}
                    onChange={(e) => set("valueT2")(e.target.value)}
                    placeholder="e.g. 4,620"
                    className="h-9"
                    style={getValueInputStyle(t2Filled, t2Warning)}
                  />
                  {t2Warning ? (
                    <HintText warning>
                      Lower than last reading ({(meter.lastReadingT2 ?? 0).toLocaleString()}).
                      Correct?
                    </HintText>
                  ) : (
                    <HintText>
                      Last: {(meter.lastReadingT2 ?? 0).toLocaleString()} {meter.unit} ·{" "}
                      {meter.lastReadingDate}
                      {t2Filled && !t2Warning && (
                        <span style={{ color: SUCCESS, fontWeight: 500 }}>
                          {" · Δ +"}
                          {t2Delta.toLocaleString()}
                        </span>
                      )}
                    </HintText>
                  )}
                </div>
              </div>
            )}

            {/* Notes field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Notes{" "}
                <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
              </label>
              <Textarea
                value={formState.notes}
                onChange={(e) => set("notes")(e.target.value)}
                placeholder="Any remarks about this reading…"
                rows={3}
              />
            </div>
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
            onClick={handleSubmit}
            className="cursor-pointer rounded-md border-0 text-sm font-medium text-white"
            style={{ height: 34, padding: "0 18px", background: ACCENT }}
          >
            {submitLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ReadingModal };
