import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { startDemoSessionAction } from "@/lib/auth/actions";

type TProps = {
  children: ReactNode;
  className?: string;
};

export const TryDemoForm = async ({ children, className }: TProps) => {
  const session = await auth();
  if (session) return null;

  return (
    <form action={startDemoSessionAction} className={className}>
      {children}
    </form>
  );
};
