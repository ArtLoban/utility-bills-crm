import { Suspense } from "react";
import type { Metadata } from "next";

import { PropertiesContent } from "./_components/properties-content";
import { PropertiesSkeleton } from "./_components/properties-skeleton";

export const metadata: Metadata = {
  title: "Properties",
  description: "Manage your properties and associated utility services.",
};

// The skeleton lives here rather than in loading.tsx: a segment's loading.tsx wraps
// every parallel slot of that segment, so alongside @modal it renders twice.
export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesSkeleton />}>
      <PropertiesContent />
    </Suspense>
  );
}
