type TKVPair = [string, React.ReactNode];
type TProps = { pairs: TKVPair[] };

export const KVGrid = ({ pairs }: TProps) => (
  <dl className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
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
