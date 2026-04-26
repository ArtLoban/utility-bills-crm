import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <AdminNav />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
