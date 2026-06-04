import { type ReactNode } from "react";
import { Breadcrumbs, TBreadcrumb } from "@/components/breadcrumbs";

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
    <div className="mx-auto w-full max-w-[1360px] px-3.5 pt-5 pb-9 md:px-8 md:pt-6 md:pb-12">
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
    </div>
  );
};
