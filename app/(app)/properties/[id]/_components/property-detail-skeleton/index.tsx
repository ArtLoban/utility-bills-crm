import { PageShell } from "@/components/page-shell";
import { PageHeaderSkeleton } from "@/components/page-header-skeleton";
import { BreadcrumbsSkeleton } from "@/components/breadcrumbs-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { TabNavSkeleton } from "@/components/tab-nav/tab-nav-skeleton";
import { ServicesCardSkeleton } from "./components/services-card-skeleton";
import { TABS, TAB_CONFIG, type TTab } from "../constants";

const BREADCRUMB_WIDTHS = ["w-16", "w-32"] as const;
const META_ITEM_WIDTHS = ["w-40", "w-20", "w-32"] as const;

const LABEL_WIDTHS: Record<TTab, string> = {
  [TABS.OVERVIEW]: "w-16",
  [TABS.METERS]: "w-14",
  [TABS.SHARING]: "w-14",
};

const TAB_LABEL_WIDTHS = TAB_CONFIG.map(({ key }) => LABEL_WIDTHS[key]);

export const PropertyDetailSkeleton = () => (
  <PageShell>
    <BreadcrumbsSkeleton itemWidths={BREADCRUMB_WIDTHS} />

    <PageHeaderSkeleton
      titleWidth="w-56"
      metaItemWidths={META_ITEM_WIDTHS}
      actions={
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      }
    />

    <TabNavSkeleton labelWidths={TAB_LABEL_WIDTHS} className="mb-5" />
    <ServicesCardSkeleton />
  </PageShell>
);
