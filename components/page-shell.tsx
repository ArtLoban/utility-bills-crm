import { type ReactNode } from "react";

type TProps = {
  children: ReactNode;
};

export const PageShell = ({ children }: TProps) => {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-3.5 pt-5 pb-9 md:px-8 md:pt-6 md:pb-12">
      {children}
    </div>
  );
};
