export type TLineLegendItem = {
  key: string;
  label: string;
  color: string;
};

type TProps = {
  items: TLineLegendItem[];
};

export const LineChartLegend = ({ items }: TProps) => (
  <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
    {items.map((item) => (
      <div key={item.key} className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <span className="h-0.5 w-3.5 rounded-[1px]" style={{ backgroundColor: item.color }} />
        {item.label}
      </div>
    ))}
  </div>
);
