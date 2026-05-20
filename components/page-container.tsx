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
    <div className="mx-auto w-full max-w-[1360px] px-8 pt-6 pb-12">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      {banner && <div className="mb-6">{banner}</div>}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          {meta}
        </div>
        <div>{actions}</div>
      </div>
      {children}
    </div>
  );
};
