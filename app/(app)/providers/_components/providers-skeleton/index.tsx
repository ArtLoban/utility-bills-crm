import { PageShell } from "@/components/page-shell";
import { PageHeaderSkeleton } from "@/components/page-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

import { ProviderCardSkeleton } from "./components/provider-card-skeleton";

const PROVIDER_NAME_WIDTHS = ["w-40", "w-32", "w-48", "w-36"] as const;
const META_ITEM_WIDTHS = ["w-44"] as const;

export const ProvidersSkeleton = () => (
  <PageShell>
    <PageHeaderSkeleton
      titleWidth="w-36"
      metaItemWidths={META_ITEM_WIDTHS}
      actions={<Skeleton className="h-8 w-36 rounded-md" />}
    />

    <div className="flex flex-col gap-2.5">
      {PROVIDER_NAME_WIDTHS.map((nameWidth) => (
        <ProviderCardSkeleton key={nameWidth} nameWidth={nameWidth} />
      ))}
    </div>
  </PageShell>
);
