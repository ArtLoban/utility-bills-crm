import { cn } from "@/lib/utils";

export type TBarLegendItem = {
  key: string;
  label: string;
  color: string;
};

type TProps = {
  items: TBarLegendItem[];
  hiddenKeys: Set<string>;
  onToggle: (key: string) => void;
};

export const BarChartLegend = ({ items, hiddenKeys, onToggle }: TProps) => (
  <div className="mt-3 flex flex-wrap items-center gap-2">
    {items.map((item) => {
      const hidden = hiddenKeys.has(item.key);
      return (
        <button
          key={item.key}
          type="button"
          onClick={() => onToggle(item.key)}
          className={cn(
            "hover:bg-muted flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-0.5 text-xs transition-colors",
            hidden && "text-muted-foreground line-through",
          )}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: hidden ? "var(--border)" : item.color }}
          />
          {item.label}
        </button>
      );
    })}
  </div>
);
