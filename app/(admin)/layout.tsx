import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { SYSTEM_ROLES } from "@/lib/auth/constants";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session?.user?.systemRole !== SYSTEM_ROLES.ADMIN) notFound();

  const { id, name, email, image, systemRole, ruLocaleEnabled } = session.user;

  return (
    <div className="flex min-h-full flex-col">
      <AdminNav
        user={{
          id,
          name: name ?? null,
          email: email ?? null,
          image: image ?? null,
          systemRole,
          ruLocaleEnabled,
        }}
      />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
