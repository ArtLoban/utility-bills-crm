import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-4 py-6 dark:bg-zinc-950">
      {children}
    </main>
  );
}
