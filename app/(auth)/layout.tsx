import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (session) redirect(ROUTES.dashboard);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-6 dark:bg-zinc-950">
      {children}
    </main>
  );
}
