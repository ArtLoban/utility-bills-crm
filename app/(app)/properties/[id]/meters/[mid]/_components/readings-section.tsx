const ReadingsSection = () => (
  <div>
    <div className="mb-3 flex items-center justify-between">
      <h2
        className="text-zinc-950 dark:text-zinc-50"
        style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}
      >
        Readings
      </h2>
    </div>
    <div
      className="rounded-[8px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30"
      style={{ padding: "32px 24px", textAlign: "center" }}
    >
      <p className="text-sm text-zinc-400 dark:text-zinc-600">
        Readings will be available in Stage 5.2.
      </p>
    </div>
  </div>
);

export { ReadingsSection };
