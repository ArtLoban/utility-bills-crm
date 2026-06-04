import { getTranslations } from "next-intl/server";

type TProps = {
  title: string;
  desc: string;
  githubUrl: string;
};

const GithubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const HeroSection = async ({ title, desc, githubUrl }: TProps) => {
  const t = await getTranslations("landing");

  return (
    <section className="relative overflow-hidden pt-[52px] pb-[72px] md:pt-[84px] md:pb-[116px]">
      {/* Glow 1 — top-right violet bloom */}
      <div
        className="pointer-events-none absolute"
        aria-hidden="true"
        style={{
          top: "-160px",
          right: "-120px",
          width: "760px",
          height: "620px",
          background: "radial-gradient(at 70% 30%, var(--hero-glow) 0%, transparent 62%)",
        }}
      />
      {/* Glow 2 — centered sub-glow over the heading area */}
      <div
        className="pointer-events-none absolute right-10 md:right-[200px]"
        aria-hidden="true"
        style={{
          top: "40px",
          width: "480px",
          height: "420px",
          background: "radial-gradient(var(--hero-glow-sub) 0%, transparent 66%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-4 md:px-6">
        <h1 className="mb-5 max-w-[680px] text-[clamp(38px,5vw,60px)] leading-[1.12] font-semibold tracking-[-0.035em] text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        <p className="mb-8 max-w-[560px] text-lg leading-[1.7] text-zinc-500">{desc}</p>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-[11px] text-sm font-medium text-white transition-colors hover:bg-violet-700"
          style={{ boxShadow: "0 2px 8px rgba(124,58,237,0.35)" }}
        >
          <GithubIcon />
          {t("project.hero.githubLink")}
        </a>
      </div>
    </section>
  );
};
