import { Code2, Database, Layers, Scale, ShieldCheck, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentType, ReactNode } from "react";

type TArchCard = {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  badgeBg: string;
  badgeBorder: string;
  iconColor: string;
  title: string;
  body: ReactNode;
};

const codeTag = (chunks: ReactNode) => (
  <code className="rounded bg-zinc-100 px-[5px] py-px font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
    {chunks}
  </code>
);

export const ArchSection = async () => {
  const t = await getTranslations("landing");

  const cards: TArchCard[] = [
    {
      icon: Layers,
      badgeBg: "bg-violet-100/80 dark:bg-violet-900/25",
      badgeBorder: "border-violet-200 dark:border-violet-700/40",
      iconColor: "text-violet-600 dark:text-violet-400",
      title: t("project.arch.card1Title"),
      body: t("project.arch.card1Body"),
    },
    {
      icon: Database,
      badgeBg: "bg-teal-100/80 dark:bg-teal-900/25",
      badgeBorder: "border-teal-200 dark:border-teal-700/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      title: t("project.arch.card2Title"),
      body: t.rich("project.arch.card2Body", { code: codeTag }),
    },
    {
      icon: Code2,
      badgeBg: "bg-blue-100/80 dark:bg-blue-900/25",
      badgeBorder: "border-blue-200 dark:border-blue-700/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      title: t("project.arch.card3Title"),
      body: t.rich("project.arch.card3Body", { code: codeTag }),
    },
    {
      icon: ShieldCheck,
      badgeBg: "bg-amber-100/80 dark:bg-amber-900/25",
      badgeBorder: "border-amber-200 dark:border-amber-700/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      title: t("project.arch.card4Title"),
      body: t("project.arch.card4Body"),
    },
    {
      icon: Scale,
      badgeBg: "bg-violet-100/80 dark:bg-violet-900/25",
      badgeBorder: "border-violet-200 dark:border-violet-700/40",
      iconColor: "text-violet-600 dark:text-violet-400",
      title: t("project.arch.card5Title"),
      body: t.rich("project.arch.card5Body", { code: codeTag }),
    },
    {
      icon: Users,
      badgeBg: "bg-teal-100/80 dark:bg-teal-900/25",
      badgeBorder: "border-teal-200 dark:border-teal-700/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      title: t("project.arch.card6Title"),
      body: t.rich("project.arch.card6Body", { code: codeTag }),
    },
  ];

  return (
    <section className="py-[56px] md:py-[92px]">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <p className="mb-3 text-xs font-medium tracking-[0.08em] text-violet-600 uppercase dark:text-violet-400">
          {t("project.arch.sectionLabel")}
        </p>
        <h2 className="mb-10 text-[clamp(28px,3vw,38px)] font-semibold tracking-[-0.025em] text-zinc-900 dark:text-zinc-50">
          {t("project.arch.sectionTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map(({ icon: Icon, badgeBg, badgeBorder, iconColor, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,box-shadow,border-color] duration-150 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(24,24,27,0.12),0_3px_8px_rgba(24,24,27,0.06)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:translate-y-0 dark:hover:border-zinc-700 dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
            >
              <div
                className={`mb-4 inline-flex size-[42px] items-center justify-center rounded-[10px] border ${badgeBg} ${badgeBorder}`}
              >
                <Icon className={`size-5 ${iconColor}`} strokeWidth={1.75} />
              </div>
              <div className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
              </div>
              <p className="text-sm leading-[1.7] text-zinc-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
