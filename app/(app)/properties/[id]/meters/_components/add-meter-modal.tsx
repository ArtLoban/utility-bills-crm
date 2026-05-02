"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCENT } from "@/lib/constants/ui-tokens";
import { SERVICE_TYPE_OPTIONS, ZONE_OPTIONS } from "../_data/mock";

type TZoneValue = "single" | "two" | "three";

type TFormState = {
  serviceType: string;
  serialNumber: string;
  zones: TZoneValue;
  installedAt: string;
  activeSince: string;
  notes: string;
};

const INITIAL_STATE: TFormState = {
  serviceType: "",
  serialNumber: "",
  zones: "single",
  installedAt: "",
  activeSince: "",
  notes: "",
};

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddMeterModal = ({ open, onOpenChange }: TProps) => {
  const [form, setForm] = useState<TFormState>(INITIAL_STATE);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setForm(INITIAL_STATE), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const set = (key: keyof TFormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canSubmit =
    form.serviceType !== "" &&
    form.serialNumber !== "" &&
    form.installedAt !== "" &&
    form.activeSince !== "";

  const handleSubmit = () => {
    // devnote: wire to server action when add-meter endpoint is ready
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
                Add meter
              </DialogTitle>
              <p
                className="text-zinc-500 dark:text-zinc-400"
                style={{ margin: "4px 0 0", fontSize: 13 }}
              >
                Register a new meter for a service on this property.
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

        {/* Body */}
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
          {/* Service type */}
          <div>
            <label className="mb-1.5 block text-[13px] font-medium">
              Service type <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
            </label>
            <div className="relative">
              <select
                value={form.serviceType}
                onChange={(e) => set("serviceType")(e.target.value)}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full appearance-none rounded-lg border bg-transparent px-2.5 pr-8 text-sm outline-none focus-visible:ring-3"
                style={{ fontFamily: "inherit" }}
              >
                <option value="" disabled>
                  Select service
                </option>
                {SERVICE_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
              />
            </div>
            <p
              className="text-zinc-500 dark:text-zinc-400"
              style={{ marginTop: 6, fontSize: 12.5 }}
            >
              Only services without an active meter are shown.
            </p>
          </div>

          {/* Serial number */}
          <div>
            <label className="mb-1.5 block text-[13px] font-medium">
              Serial number <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
            </label>
            <Input
              value={form.serialNumber}
              onChange={(e) => set("serialNumber")(e.target.value)}
              placeholder="e.g. NIK-12345"
              className="h-9"
            />
          </div>

          {/* Zones */}
          <div>
            <label className="mb-1.5 block text-[13px] font-medium">
              Zones <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
            </label>
            <div className="relative">
              <select
                value={form.zones}
                onChange={(e) => set("zones")(e.target.value)}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full appearance-none rounded-lg border bg-transparent px-2.5 pr-8 text-sm outline-none focus-visible:ring-3"
                style={{ fontFamily: "inherit" }}
              >
                {ZONE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
              />
            </div>
          </div>

          {/* Installed at / Active since */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium">
                  Installed at{" "}
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={form.installedAt}
                    onChange={(e) => set("installedAt")(e.target.value)}
                    className="h-9 pl-9"
                  />
                  <Calendar
                    size={14}
                    className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium">
                  Active since{" "}
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={form.activeSince}
                    onChange={(e) => set("activeSince")(e.target.value)}
                    className="h-9 pl-9"
                  />
                  <Calendar
                    size={14}
                    className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                  />
                </div>
              </div>
            </div>
            <p
              className="text-zinc-500 dark:text-zinc-400"
              style={{ marginTop: 6, fontSize: 12.5, lineHeight: 1.55 }}
            >
              Active since: when this meter started being used. Often the same as installation date.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[13px] font-medium">
              Notes <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
            </label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Where it's located, anything worth remembering…"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end border-t border-zinc-200 dark:border-zinc-800"
          style={{ padding: "16px 24px", gap: 8, borderRadius: "0 0 12px 12px" }}
        >
          <DialogClose
            className="cursor-pointer rounded-md border border-zinc-200 bg-white px-4 text-[13.5px] font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 36 }}
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={
              !canSubmit
                ? "cursor-default rounded-md border-0 bg-zinc-200 px-4 text-[13.5px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                : "cursor-pointer rounded-md border-0 text-[13.5px] font-medium text-white"
            }
            style={{
              height: 36,
              padding: "0 18px",
              ...(canSubmit ? { background: ACCENT } : {}),
            }}
          >
            Add meter
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddMeterModal };
