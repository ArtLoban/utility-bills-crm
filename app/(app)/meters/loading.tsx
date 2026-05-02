const MetersLoading = () => {
  return (
    <div className="flex-1 bg-zinc-100 md:bg-white dark:bg-zinc-950 md:dark:bg-zinc-950">
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 32px 48px" }}>
        {/* Page header skeleton */}
        <div className="hidden md:block" style={{ marginBottom: 24 }}>
          <div
            className="animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"
            style={{ width: 120, height: 32, marginBottom: 8 }}
          />
          <div
            className="animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60"
            style={{ width: 220, height: 16 }}
          />
        </div>

        {/* Filter bar skeleton */}
        <div className="hidden md:block">
          <div
            className="animate-pulse rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            style={{ height: 52, marginBottom: 16 }}
          />

          {/* Table skeleton */}
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div
              className="bg-zinc-50 dark:bg-zinc-900"
              style={{ height: 40, borderBottom: "1px solid" }}
            />
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse border-b border-zinc-100 bg-white dark:border-zinc-800/50 dark:bg-zinc-900"
                style={{ height: 52, animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Mobile skeleton */}
        <div className="md:hidden" style={{ margin: "0 -32px", padding: "20px 14px 32px" }}>
          <div
            className="animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"
            style={{ width: 100, height: 26, marginBottom: 14 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                style={{ height: 72, animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetersLoading;
