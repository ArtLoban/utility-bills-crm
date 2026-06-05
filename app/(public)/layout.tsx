import type { ReactNode } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "./_components/public-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <PublicFooter />
    </div>
  );
}
