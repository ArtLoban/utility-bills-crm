export type TLineLegendItem = {
  key: string;
  label: string;
  color: string;
};

type TProps = {
  items: TLineLegendItem[];
};

// Legend for the line charts (LineCard design): each series is a short horizontal
// line segment + label, muted. Distinct from the bar/pie square swatches.
export const LineChartLegend = ({ items }: TProps) => (
  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 pt-1">
    {items.map((item) => (
      <div key={item.key} className="text-muted-foreground flex items-center gap-1.5 text-[11.5px]">
        <span className="h-0.5 w-3.5 rounded-[1px]" style={{ backgroundColor: item.color }} />
        {item.label}
      </div>
    ))}
  </div>
);
