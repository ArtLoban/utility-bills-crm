type TKVPair = [string, React.ReactNode];
type TProps = { pairs: TKVPair[]; cols?: number };

export const KVGrid = ({ pairs, cols = 2 }: TProps) => (
  <dl className="grid gap-x-8 gap-y-3.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
    {pairs.map(([key, value]) => (
      <div key={key}>
        <dt className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
          {key}
        </dt>
        <dd className="text-foreground text-sm leading-snug">{value}</dd>
      </div>
    ))}
  </dl>
);
