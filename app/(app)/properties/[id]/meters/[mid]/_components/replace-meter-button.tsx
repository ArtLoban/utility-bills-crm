"use client";

import { useRouter } from "next/navigation";

import type { TMeter } from "@/lib/db/schema/meters";

type TProps = { meter: TMeter };

const ReplaceMeterButton = ({ meter }: TProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/properties/${meter.propertyId}/meters/${meter.id}/replace`)}
      className="inline-flex cursor-pointer items-center rounded-md border border-violet-100 bg-violet-50 text-sm font-medium text-violet-600 dark:border-violet-800/40 dark:bg-violet-950/40 dark:text-violet-400"
      style={{ height: 32, padding: "0 14px" }}
    >
      Replace meter
    </button>
  );
};

export { ReplaceMeterButton };
