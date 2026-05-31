import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-col">
      <AdminNav user={{ image: session?.user?.image ?? null }} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
