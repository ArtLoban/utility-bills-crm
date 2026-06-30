import { Users, History, Wallet, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";
import { CmsText } from "@/components/cms-text";

type TCard = { title: string; body: string };

type TProps = {
  cards: [TCard, TCard, TCard, TCard];
};

const FEATURE_CONFIG = [
  {
    icon: Users,
    badgeBg: "bg-violet-100 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: History,
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Wallet,
    badgeBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    icon: TrendingUp,
    badgeBg: "bg-sky-100 dark:bg-sky-900/30",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
] as const satisfies ReadonlyArray<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  badgeBg: string;
  iconColor: string;
}>;

export const FeaturesSection = ({ cards }: TProps) => {
  const rows = [
    { ...FEATURE_CONFIG[0], title: cards[0].title, body: cards[0].body },
    { ...FEATURE_CONFIG[1], title: cards[1].title, body: cards[1].body },
    { ...FEATURE_CONFIG[2], title: cards[2].title, body: cards[2].body },
    { ...FEATURE_CONFIG[3], title: cards[3].title, body: cards[3].body },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-[116px]">
      {/* Radial glow — bottom-left bloom, bleeds slightly below into the dark mockup section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          bottom: "-180px",
          left: "-120px",
          width: "720px",
          height: "580px",
          background: "radial-gradient(at 30% 70%, var(--section-glow) 0%, transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 md:mb-12">
          <p className="text-primary mb-2.5 text-xs font-medium tracking-[0.08em] uppercase">
            Features
          </p>
          <h2 className="text-foreground text-[clamp(30px,3vw,36px)] font-semibold tracking-[-0.02em]">
            Built around how households actually work
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rows.map(({ icon: Icon, badgeBg, iconColor, title, body }) => {
            return (
              <div
                key={title}
                className="border-border bg-card rounded-xl border p-6 shadow-sm transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(24,24,27,0.12),0_3px_8px_rgba(24,24,27,0.06)] dark:shadow-none dark:hover:translate-y-0 dark:hover:border-zinc-700 dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
              >
                <div
                  className={`mb-5 inline-flex size-11 items-center justify-center rounded-xl ${badgeBg}`}
                >
                  <Icon className={`size-5 ${iconColor}`} strokeWidth={1.75} />
                </div>
                <p className="text-md text-foreground mb-2 font-semibold">{title}</p>
                <p className="text-muted-foreground text-sm leading-[1.65]">
                  <CmsText value={body} />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
