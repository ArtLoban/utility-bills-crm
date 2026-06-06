import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { AppNav } from "@/components/app-nav";
import { DemoBanner } from "@/components/demo-banner";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const session = await auth();
  if (!session) redirect(ROUTES.login);

  const { id, name, email, image, systemRole, ruLocaleEnabled, isDemo } = session.user;

  return (
    <div className="flex min-h-full flex-col">
      <AppNav
        user={{
          id,
          name: name ?? null,
          email: email ?? null,
          image: image ?? null,
          systemRole,
          ruLocaleEnabled,
        }}
      />
      {isDemo && <DemoBanner />}
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
