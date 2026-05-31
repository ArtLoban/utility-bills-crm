import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { SYSTEM_ROLES } from "@/lib/auth/constants";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session?.user?.systemRole !== SYSTEM_ROLES.ADMIN) notFound();

  return (
    <div className="flex min-h-full flex-col">
      <AdminNav user={{ image: session.user.image ?? null }} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
