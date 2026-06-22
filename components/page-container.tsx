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
      <div className="mb-5 md:mb-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
          {actions && <div>{actions}</div>}
        </div>
        {meta}
      </div>
      {children}
    </PageShell>
  );
};
