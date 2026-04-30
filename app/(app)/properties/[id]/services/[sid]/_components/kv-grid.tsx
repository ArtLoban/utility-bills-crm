type TKVPair = [string, React.ReactNode];
type TProps = { pairs: TKVPair[]; cols?: number };

const KVGrid = ({ pairs, cols = 2 }: TProps) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "14px 32px",
    }}
  >
    {pairs.map(([key, value]) => (
      <div key={key}>
        <div
          className="text-zinc-500 dark:text-zinc-400"
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 0.3,
            marginBottom: 4,
          }}
        >
          {key}
        </div>
        <div
          className="text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, lineHeight: 1.4 }}
        >
          {value}
        </div>
      </div>
    ))}
  </div>
);

export { KVGrid };
