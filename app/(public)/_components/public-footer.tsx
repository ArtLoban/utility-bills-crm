import Link from "next/link";

export const PublicFooter = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-3 px-4 py-6 text-center sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <nav className="flex gap-4">
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            About
          </Link>
          <Link
            href="/project"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Project
          </Link>
        </nav>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} UtilityBills CRM
        </p>
      </div>
    </footer>
  );
};
