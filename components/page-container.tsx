import { type ReactNode } from "react";
import { Breadcrumbs, TBreadcrumb } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";

export type TProps = {
  title: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  breadcrumbs?: TBreadcrumb[];
  banner?: ReactNode;
};

export const PageContainer = ({ title, children, actions, meta, breadcrumbs, banner }: TProps) => {
  return (
    <PageShell>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      {banner && <div className="mb-6">{banner}</div>}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 md:mb-7">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
          {meta}
        </div>
        {actions && <div className="self-end sm:self-auto">{actions}</div>}
      </div>
      {children}
    </PageShell>
  );
};
