import Link from "next/link";
import { ChevronRight } from "lucide-react";

type TBreadcrumb = { label: string; href?: string };
type TProps = { items: TBreadcrumb[] };

const Breadcrumbs = ({ items }: TProps) => (
  <nav className="mb-4 flex items-center gap-1" style={{ fontSize: 13 }}>
    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={13} className="text-zinc-300 dark:text-zinc-700" />}
          {isLast || !item.href ? (
            <span
              className={
                isLast ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-500 dark:text-zinc-400"
              }
            >
              {item.label}
            </span>
          ) : (
            <Link href={item.href} className="text-zinc-500 no-underline dark:text-zinc-400">
              {item.label}
            </Link>
          )}
        </span>
      );
    })}
  </nav>
);

export { Breadcrumbs };
