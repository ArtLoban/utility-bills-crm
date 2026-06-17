import type { ReactNode } from "react";

type TProps = {
  title: string;
  children: ReactNode;
};

export const LegalSection = ({ title, children }: TProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      {children}
    </section>
  );
};
