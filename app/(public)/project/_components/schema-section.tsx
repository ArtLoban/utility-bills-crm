type TSchemaLine = {
  tree: string;
  name: string;
  note?: string;
};

const SCHEMA_TREE: TSchemaLine[] = [
  { tree: "", name: "User" },
  { tree: "├── ", name: "PropertyAccess", note: "(role: owner / editor / viewer)" },
  { tree: "└── ", name: "Property" },
  { tree: "    ├── ", name: "Service", note: "(electricity, gas, water, …)" },
  { tree: "    │   ├── ", name: "Contract", note: "(provider, period)" },
  { tree: "    │   │   ├── ", name: "Tariff", note: "(rates over time)" },
  { tree: "    │   │   ├── ", name: "AccountNumber", note: "(over time)" },
  { tree: "    │   │   └── ", name: "PaymentDetails", note: "(over time)" },
  { tree: "    │   ├── ", name: "Bill", note: "(period, amount)" },
  { tree: "    │   └── ", name: "Payment", note: "(date, amount)" },
  { tree: "    └── ", name: "Meter", note: "(physical device)" },
  { tree: "        └── ", name: "Reading", note: "(date, value(s))" },
];

export const SchemaSection = () => {
  return (
    <section
      className="relative overflow-hidden py-[56px] md:py-[92px]"
      style={{ background: "var(--lander-band-bg)" }}
    >
      {/* Purple glow centered behind the schema panel */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          width: "680px",
          height: "480px",
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.30) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-4 md:px-6">
        <p
          className="mb-3 text-xs font-medium tracking-[0.08em] uppercase"
          style={{ color: "#cbb6f5" }}
        >
          Data model
        </p>
        <h2 className="mb-10 text-[clamp(28px,3vw,38px)] font-semibold tracking-[-0.025em] text-zinc-100">
          One tree, every entity
        </h2>

        {/* Panel wrapper — scroll on mobile, full width on desktop */}
        <div className="overflow-x-auto">
          <div
            className="min-w-[480px] rounded-xl font-mono text-sm leading-[1.85]"
            style={{
              background: "#0d0d11",
              border: "1px solid #27272a",
              padding: "28px 32px",
            }}
          >
            <pre className="m-0 bg-transparent p-0">
              {SCHEMA_TREE.map((line, i) => (
                <span key={i} className="block">
                  <span style={{ color: "#3f3f46" }}>{line.tree}</span>
                  <span style={{ color: "#e4e4e7" }}>{line.name}</span>
                  {line.note && <span style={{ color: "#71717a" }}> {line.note}</span>}
                </span>
              ))}
            </pre>
          </div>
        </div>

        <p className="mt-6 text-center text-sm leading-[1.65] text-zinc-400">
          Full schema in the GitHub repository — Drizzle definitions, exclusion constraints,
          indexes, the lot.
        </p>
      </div>
    </section>
  );
};
