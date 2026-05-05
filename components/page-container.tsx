import { type ReactNode } from "react";

export type TProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

export const PageContainer = ({ title, children, actions }: TProps) => {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-8 pt-8 pb-12">
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div>{actions}</div>
      </div>
      {children}
    </div>
  );
};
