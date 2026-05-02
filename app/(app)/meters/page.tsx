import { Suspense } from "react";
import type { Metadata } from "next";

import { MetersClient } from "./_components/meters-client";

export const metadata: Metadata = { title: "Meters" };

export default function MetersPage() {
  return (
    <div className="flex-1 bg-zinc-100 md:bg-white dark:bg-zinc-950 md:dark:bg-zinc-950">
      <Suspense>
        <MetersClient />
      </Suspense>
    </div>
  );
}
