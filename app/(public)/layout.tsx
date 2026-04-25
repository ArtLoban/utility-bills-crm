export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Utility Bills CRM
        </span>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
