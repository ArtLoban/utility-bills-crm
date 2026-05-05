import { Code2, Database, Layers, Scale, ShieldCheck, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

const codeTag = (chunks: ReactNode) => (
  <code className="rounded bg-zinc-100 px-[5px] py-px font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
    {chunks}
  </code>
);

const ARCH_ICONS = [
  <Layers key="layers" className="size-[18px]" />,
  <Database key="database" className="size-[18px]" />,
  <Code2 key="code2" className="size-[18px]" />,
  <ShieldCheck key="shield" className="size-[18px]" />,
  <Scale key="scale" className="size-[18px]" />,
  <Users key="users" className="size-[18px]" />,
];

export const ArchSection = async () => {
  const t = await getTranslations("landing");

  const cards = [
    { title: t("project.arch.card1Title"), body: t("project.arch.card1Body") },
    {
      title: t("project.arch.card2Title"),
      body: t.rich("project.arch.card2Body", { code: codeTag }),
    },
    {
      title: t("project.arch.card3Title"),
      body: t.rich("project.arch.card3Body", { code: codeTag }),
    },
    { title: t("project.arch.card4Title"), body: t("project.arch.card4Body") },
    {
      title: t("project.arch.card5Title"),
      body: t.rich("project.arch.card5Body", { code: codeTag }),
    },
    {
      title: t("project.arch.card6Title"),
      body: t.rich("project.arch.card6Body", { code: codeTag }),
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-xs font-medium tracking-[0.08em] text-violet-600 uppercase dark:text-violet-400">
          {t("project.arch.sectionLabel")}
        </p>
        <h2 className="mb-10 text-[clamp(24px,2.8vw,32px)] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
          {t("project.arch.sectionTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
            >
              <div className="mb-3.5 text-violet-600 dark:text-violet-400">{ARCH_ICONS[i]}</div>
              <div className="mb-2.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {card.title}
              </div>
              <p className="text-sm leading-[1.7] text-zinc-500">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
