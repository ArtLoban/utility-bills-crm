"use client";

import type { ReactNode } from "react";
import { startDemoSessionAction } from "@/lib/auth/actions";
import { usePublicSession } from "@/lib/hooks/use-public-session";

type TProps = {
  children: ReactNode;
  className?: string;
};

export const TryDemoForm = ({ children, className }: TProps) => {
  const { user } = usePublicSession();

  if (user) return null;

  return (
    <form action={startDemoSessionAction} className={className}>
      {children}
    </form>
  );
};
