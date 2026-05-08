import { type ReactNode } from "react";
import { Breadcrumbs, TBreadcrumb } from "@/components/breadcrumbs";

export type TProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  breadcrumbs?: TBreadcrumb[];
};

export const PageContainer = ({ title, children, actions, meta, breadcrumbs }: TProps) => {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-8 pt-6 pb-12">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
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
