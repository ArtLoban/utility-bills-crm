import { PageShell } from "@/components/page-shell";
import { PageHeaderSkeleton } from "@/components/page-header-skeleton";
import { BreadcrumbsSkeleton } from "@/components/breadcrumbs-skeleton";
import { TabNavSkeleton } from "@/components/tab-nav/tab-nav-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { SERVICE_TABS, SERVICE_TAB_CONFIG, type TServiceTab } from "../constants";
import { BalanceCardSkeleton } from "./components/balance-card-skeleton";
import { NotesCardSkeleton } from "./components/notes-card-skeleton";
import { ActivityCardSkeleton } from "./components/activity-card-skeleton";

const BREADCRUMB_WIDTHS = ["w-16", "w-32", "w-20"] as const;
const META_ITEM_WIDTHS = ["w-24", "w-32"] as const;

const LABEL_WIDTHS: Record<TServiceTab, string> = {
  [SERVICE_TABS.OVERVIEW]: "w-16",
  [SERVICE_TABS.CONTRACT]: "w-16",
  [SERVICE_TABS.METER]: "w-12",
  [SERVICE_TABS.REMINDERS]: "w-20",
};

const TAB_LABEL_WIDTHS = SERVICE_TAB_CONFIG.map(({ key }) => LABEL_WIDTHS[key]);

export const ServiceDetailSkeleton = () => (
  <PageShell>
    <BreadcrumbsSkeleton itemWidths={BREADCRUMB_WIDTHS} />

    <PageHeaderSkeleton
      titleWidth="w-48"
      metaItemWidths={META_ITEM_WIDTHS}
      leading={<Skeleton className="size-11 shrink-0 rounded-lg" />}
      actions={
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      }
    />

    <TabNavSkeleton labelWidths={TAB_LABEL_WIDTHS} className="mb-6" />

    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <BalanceCardSkeleton />
        <NotesCardSkeleton />
      </div>
      <ActivityCardSkeleton />
    </div>
  </PageShell>
);
