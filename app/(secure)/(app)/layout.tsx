import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/guards";
import { AppNav } from "@/components/app-nav";
import { DemoBanner } from "@/components/demo-banner";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const { id, name, email, image, systemRole, ruLocaleEnabled, isDemo } = await requireSession();

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
