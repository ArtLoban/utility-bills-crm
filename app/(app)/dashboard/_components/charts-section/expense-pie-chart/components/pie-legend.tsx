export type TPieLegendItem = {
  key: string;
  label: string;
  color: string;
  percent: number;
};

type TProps = {
  items: TPieLegendItem[];
};

export const PieLegend = ({ items }: TProps) => (
  <ul className="flex list-none flex-col gap-2.5">
    {items.map((item) => (
      <li key={item.key} className="flex items-center gap-2.5 text-sm">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-foreground">{item.label}</span>
        <span className="text-muted-foreground ml-auto text-xs font-medium tabular-nums">
          {item.percent}%
        </span>
      </li>
    ))}
  </ul>
);
