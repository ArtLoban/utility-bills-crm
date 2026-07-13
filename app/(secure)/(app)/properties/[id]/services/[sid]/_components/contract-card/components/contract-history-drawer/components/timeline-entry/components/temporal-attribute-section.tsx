import type { ReactNode } from "react";

import { formatPeriod } from "../utils";

type TTemporalItem = {
  id: string;
  validFrom: Date;
  validTo: Date | null;
};

type TProps<TItem extends TTemporalItem> = {
  label: string;
  items: TItem[];
  presentLabel: string;
  renderValue: (item: TItem) => ReactNode;
};

const SECTION_LABEL_CLASS =
  "text-foreground/80 mb-1.5 text-xs font-semibold tracking-wide uppercase";
const PERIOD_CLASS = "text-foreground/80 text-xs sm:w-40 sm:shrink-0";

export const TemporalAttributeSection = <TItem extends TTemporalItem>({
  label,
  items,
  presentLabel,
  renderValue,
}: TProps<TItem>) => (
  <div>
    <p className={SECTION_LABEL_CLASS}>{label}</p>
    <div className="flex flex-col gap-1.5">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-2">
          <span className={PERIOD_CLASS}>
            {formatPeriod(item.validFrom, item.validTo, presentLabel)}
          </span>
          {renderValue(item)}
        </div>
      ))}
    </div>
  </div>
);
