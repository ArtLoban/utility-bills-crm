"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronDown, Info, X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCENT } from "@/lib/constants/ui-tokens";

import type { TMeterDetail } from "../_data/mock";

type TZoneCount = "single" | "two" | "three";

type TFormState = {
  replacementDate: string;
  serialNumber: string;
  zones: TZoneCount;
  readingT1: string;
  readingT2: string;
  readingT3: string;
  notes: string;
};

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meter: TMeterDetail;
};

const zonesFromNumber = (n: number): TZoneCount => (n === 3 ? "three" : n === 2 ? "two" : "single");

const makeInitialState = (meter: TMeterDetail): TFormState => ({
  replacementDate: "",
  serialNumber: "",
  zones: zonesFromNumber(meter.zones),
  readingT1: "",
  readingT2: "",
  readingT3: "",
  notes: "",
});

const ReplaceMeterModal = ({ open, onOpenChange, meter }: TProps) => {
  const [form, setForm] = useState<TFormState>(() => makeInitialState(meter));

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setForm(makeInitialState(meter)), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const set = (key: keyof TFormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const serviceLabel = meter.serviceType.charAt(0).toUpperCase() + meter.serviceType.slice(1);

  const handleSubmit = () => {
    // devnote: wire to server action when replace-meter endpoint is ready
    // Payload: { replacementDate, newSerialNumber, zones, initialReadings: { t1, t2?, t3? }, notes }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[448px] gap-0 rounded-[12px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[448px]"
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 0" }}>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle
                style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, margin: 0 }}
              >
                Replace meter
              </DialogTitle>
              <p
                className="text-zinc-500 dark:text-zinc-400"
                style={{ margin: "4px 0 0", fontSize: 13 }}
              >
                {serviceLabel} meter · {meter.serialNumber}
              </p>
            </div>
            <DialogClose className="flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
              <X size={15} />
            </DialogClose>
          </div>
          <div
            className="border-t border-zinc-200 dark:border-zinc-800"
            style={{ marginTop: 20 }}
          />
        </div>

        {/* Scrollable body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Replacement date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Replacement date{" "}
              <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
            </label>
            <div className="relative">
              {/* devnote: replace with date picker component when available */}
              <Input
                type="date"
                value={form.replacementDate}
                onChange={(e) => set("replacementDate")(e.target.value)}
                className="h-9 pl-9"
              />
              <Calendar
                size={15}
                className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
              />
            </div>
            <p
              className="text-zinc-500 dark:text-zinc-400"
              style={{ marginTop: 6, fontSize: 12.5, lineHeight: 1.55 }}
            >
              When the new meter takes over.
            </p>
          </div>

          {/* Section divider */}
          <div className="flex items-center" style={{ gap: 10 }}>
            <hr className="flex-1 border-zinc-200 dark:border-zinc-800" />
            <span
              className="whitespace-nowrap text-zinc-400 dark:text-zinc-600"
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              New meter
            </span>
            <hr className="flex-1 border-zinc-200 dark:border-zinc-800" />
          </div>

          {/* Serial number */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Serial number <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
            </label>
            <Input
              value={form.serialNumber}
              onChange={(e) => set("serialNumber")(e.target.value)}
              placeholder="e.g. NIK-67890"
              className="h-9"
              autoFocus
            />
          </div>

          {/* Zones */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Zones <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
            </label>
            <div className="relative">
              <select
                value={form.zones}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    zones: e.target.value as TZoneCount,
                    readingT1: "",
                    readingT2: "",
                    readingT3: "",
                  }))
                }
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full appearance-none rounded-lg border bg-transparent px-2.5 pr-8 text-sm outline-none focus-visible:ring-3"
                style={{ fontFamily: "inherit" }}
              >
                <option value="single">Single zone</option>
                <option value="two">Two zones (day / night)</option>
                <option value="three">Three zones (peak / shoulder / off-peak)</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
              />
            </div>
          </div>

          {/* Initial readings */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Initial readings{" "}
              <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
            </label>
            {form.zones === "single" && (
              <Input
                type="number"
                value={form.readingT1}
                onChange={(e) => set("readingT1")(e.target.value)}
                placeholder="0"
                className="h-9 text-right"
                style={{ fontVariantNumeric: "tabular-nums" }}
              />
            )}
            {form.zones === "two" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div className="mb-1 text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
                    T1 (day)
                  </div>
                  <Input
                    type="number"
                    value={form.readingT1}
                    onChange={(e) => set("readingT1")(e.target.value)}
                    placeholder="0"
                    className="h-9 text-right"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
                <div>
                  <div className="mb-1 text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
                    T2 (night)
                  </div>
                  <Input
                    type="number"
                    value={form.readingT2}
                    onChange={(e) => set("readingT2")(e.target.value)}
                    placeholder="0"
                    className="h-9 text-right"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
              </div>
            )}
            {form.zones === "three" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <div className="mb-1 text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
                    T1 (peak)
                  </div>
                  <Input
                    type="number"
                    value={form.readingT1}
                    onChange={(e) => set("readingT1")(e.target.value)}
                    placeholder="0"
                    className="h-9 text-right"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
                <div>
                  <div className="mb-1 text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
                    T2 (shoulder)
                  </div>
                  <Input
                    type="number"
                    value={form.readingT2}
                    onChange={(e) => set("readingT2")(e.target.value)}
                    placeholder="0"
                    className="h-9 text-right"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
                <div>
                  <div className="mb-1 text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
                    T3 (off-peak)
                  </div>
                  <Input
                    type="number"
                    value={form.readingT3}
                    onChange={(e) => set("readingT3")(e.target.value)}
                    placeholder="0"
                    className="h-9 text-right"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
              </div>
            )}
            <p
              className="text-zinc-500 dark:text-zinc-400"
              style={{ marginTop: 6, fontSize: 12.5, lineHeight: 1.55 }}
            >
              Starting values shown on the new meter when installed. Usually 0.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Notes <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
            </label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Anything worth noting about this replacement…"
              rows={3}
            />
          </div>

          {/* Info alert */}
          <div
            className="border border-zinc-200 dark:border-zinc-800"
            style={{ borderRadius: 8, padding: "14px 16px" }}
          >
            <div className="flex items-start" style={{ gap: 10 }}>
              <Info size={15} className="mt-0.5 shrink-0 text-zinc-400 dark:text-zinc-600" />
              <div>
                <p
                  className="text-zinc-950 dark:text-zinc-50"
                  style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600 }}
                >
                  What happens when you replace a meter
                </p>
                <div
                  className="flex flex-col text-zinc-500 dark:text-zinc-400"
                  style={{ gap: 4, fontSize: 12.5, lineHeight: 1.6 }}
                >
                  <span>The current meter will be marked as removed on the replacement date.</span>
                  <span>All its readings stay attached to it for history.</span>
                  <span>The new meter starts fresh from this date forward.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end border-t border-zinc-200 dark:border-zinc-800"
          style={{ padding: "16px 24px", gap: 8, borderRadius: "0 0 12px 12px" }}
        >
          <DialogClose
            className="cursor-pointer rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 36 }}
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleSubmit}
            className="cursor-pointer rounded-md border-0 text-sm font-medium text-white"
            style={{ height: 36, padding: "0 18px", background: ACCENT }}
          >
            Replace
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ReplaceMeterModal };
