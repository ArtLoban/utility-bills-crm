type TProps = {
  heroTitle: string;
  heroDesc: string;
};

export const HeroSection = ({ heroTitle, heroDesc }: TProps) => {
  return (
    <section className="relative overflow-hidden pt-[52px] pb-16 md:pt-[84px] md:pb-[116px]">
      {/* Glow 1 — top-right, larger violet bloom */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-160px",
          right: "-120px",
          width: "760px",
          height: "620px",
          background: "radial-gradient(at 70% 30%, var(--hero-glow) 0%, transparent 62%)",
        }}
      />
      {/* Glow 2 — centered, softer sub-glow over the heading area */}
      <div
        className="pointer-events-none absolute right-10 md:right-[200px]"
        style={{
          top: "40px",
          width: "480px",
          height: "420px",
          background: "radial-gradient(var(--hero-glow-sub) 0%, transparent 66%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-4 md:px-6">
        {/* Eyebrow badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 dark:border-violet-800/50 dark:bg-violet-950/40">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="4" height="4" rx="0.75" fill="#7c3aed" />
            <rect x="7.5" y="0.5" width="4" height="4" rx="0.75" fill="#7c3aed" opacity="0.5" />
            <rect x="0.5" y="7.5" width="4" height="4" rx="0.75" fill="#7c3aed" opacity="0.5" />
            <rect x="7.5" y="7.5" width="4" height="4" rx="0.75" fill="#7c3aed" opacity="0.3" />
          </svg>
          <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
            Portfolio project
          </span>
        </div>

        <h1 className="mb-5 max-w-[720px] text-[clamp(40px,5vw,56px)] leading-[1.12] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
          {heroTitle}
        </h1>

        <p className="max-w-[580px] text-lg leading-[1.65] text-zinc-500">{heroDesc}</p>

        <p className="text-md mt-4 max-w-[580px] leading-[1.65] text-zinc-500">
          Built as a portfolio piece and a real product. The first user is the author&apos;s wife,
          who&apos;s been tracking two apartments in a paper notebook for years.
        </p>
      </div>
    </section>
  );
};
