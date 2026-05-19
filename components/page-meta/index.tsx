import { Fragment, ReactNode } from "react";

import { PageMetaSkeleton } from "./components/page-meta-skeleton";

type TProps = {
  items: ReactNode[] | null;
};

export const PageMeta = ({ items }: TProps) => {
  if (items === null) return <PageMetaSkeleton />;

  const filtered = items.filter(Boolean);

  return (
    <div className="mt-1.5 flex items-center gap-2 text-sm text-zinc-500">
      {filtered.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span className="text-zinc-300 dark:text-zinc-700">·</span>}
          {item}
        </Fragment>
      ))}
    </div>
  );
};
