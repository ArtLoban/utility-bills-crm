import type { Metadata } from "next";

import { BillsClient } from "./_components/bills-client";

export const metadata: Metadata = { title: "Bills" };

export default function BillsPage() {
  return (
    <div className="flex-1 bg-zinc-100 md:bg-white dark:bg-zinc-950 md:dark:bg-zinc-950">
      <BillsClient />
    </div>
  );
}
