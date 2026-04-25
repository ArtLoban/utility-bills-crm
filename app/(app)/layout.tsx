import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <nav className="flex items-center gap-6">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Utility Bills CRM
          </span>
          <span className="text-xs text-zinc-400">App shell — placeholder</span>
        </nav>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
