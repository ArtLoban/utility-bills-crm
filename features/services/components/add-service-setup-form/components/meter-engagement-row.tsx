"use client";

import { Gauge } from "lucide-react";

import { Switch } from "@/components/ui/switch";

type TProps = {
  title: string;
  desc: string;
  engaged: boolean;
  onToggle: (v: boolean) => void;
};

export const MeterEngagementRow = ({ title, desc, engaged, onToggle }: TProps) => (
  <div
    className="flex items-center justify-between rounded-lg p-4"
    style={{
      background: engaged ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "var(--muted)",
      border: `1px solid ${engaged ? "color-mix(in srgb, var(--primary) 25%, transparent)" : "var(--border)"}`,
    }}
  >
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: engaged
            ? "color-mix(in srgb, var(--primary) 14%, transparent)"
            : "var(--background)",
          border: "1px solid var(--border)",
        }}
      >
        <Gauge size={16} className={engaged ? "text-primary" : "text-muted-foreground"} />
      </div>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{desc}</p>
      </div>
    </div>
    <Switch checked={engaged} onCheckedChange={onToggle} className="ml-4 shrink-0" />
  </div>
);
