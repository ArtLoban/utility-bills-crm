"use client";

import { Gauge } from "lucide-react";

import { Switch } from "@/components/ui/switch";

type TProps = {
  title: string;
  desc: string;
  engaged: boolean;
  onToggle: (engaged: boolean) => void;
};

export const MeterEngagementRow = ({ title, desc, engaged, onToggle }: TProps) => (
  <div
    data-engaged={engaged || undefined}
    className="bg-muted data-[engaged]:bg-primary/10 data-[engaged]:border-primary/25 flex items-center justify-between rounded-lg border p-4"
  >
    <div className="flex min-w-0 items-center gap-3">
      <div
        data-engaged={engaged || undefined}
        className="bg-background data-[engaged]:bg-primary/15 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
      >
        <Gauge size={16} className={engaged ? "text-primary" : "text-muted-foreground"} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{desc}</p>
      </div>
    </div>
    <Switch checked={engaged} onCheckedChange={onToggle} className="ml-4 shrink-0" />
  </div>
);
