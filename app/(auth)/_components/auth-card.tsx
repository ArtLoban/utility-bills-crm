import type { ReactNode } from "react";

type TProps = {
  children: ReactNode;
};

export const AuthCard = ({ children }: TProps) => {
  return (
    <div className="w-full max-w-[400px]">
      <div className="rounded-[10px] border border-zinc-200 bg-white px-7 py-8 shadow-[0_1px_3px_rgba(24,24,27,0.07),0_1px_2px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        {children}
      </div>
      <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
        By signing in you agree to the{" "}
        <a href="#" className="underline underline-offset-2">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};
