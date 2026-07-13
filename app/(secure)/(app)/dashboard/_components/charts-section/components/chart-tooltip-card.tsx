export type TTooltipRow = {
  key: string;
  label: string;
  color: string;
  value: string;
};

type TProps = {
  header?: string;
  rows: TTooltipRow[];
  total?: { label: string; value: string };
};

// Tooltip card matching the dashboard design (StackedBarCard): a header, one row
// per series (swatch + label + value), and an optional "Total" footer. Surface
// colours use semantic tokens so the card follows the active theme — light on the
// light dashboard, dark in dark mode.
export const ChartTooltipCard = ({ header, rows, total }: TProps) => (
  <div className="bg-popover text-popover-foreground min-w-50 rounded-md border px-3 py-2.5 text-xs shadow-xl">
    {header && <div className="mb-2 border-b pb-1.5 font-semibold">{header}</div>}

    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: row.color }} />
          <span className="text-muted-foreground flex-1">{row.label}</span>
          <span className="font-medium tabular-nums">{row.value}</span>
        </div>
      ))}
    </div>

    {total && (
      <div className="mt-2 flex items-center gap-2 border-t pt-1.5">
        <span className="text-muted-foreground flex-1">{total.label}</span>
        <span className="font-semibold tabular-nums">{total.value}</span>
      </div>
    )}
  </div>
);
