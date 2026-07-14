import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/icon-badge";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "404 — Page not found",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center md:pb-20">
      <IconBadge icon={SearchX} color="var(--muted-foreground)" size="xl" />

      <h2 className="mt-6 text-xl font-semibold md:text-2xl">Page not found</h2>

      <p className="text-muted-foreground mt-2.5 max-w-xs text-sm leading-relaxed md:max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      <div className="mt-6 w-full max-w-72 md:w-auto">
        <Button asChild variant="default" className="h-11 w-full md:h-9 md:w-auto">
          <Link href={ROUTES.home}>Go home</Link>
        </Button>
      </div>
    </div>
  );
}
