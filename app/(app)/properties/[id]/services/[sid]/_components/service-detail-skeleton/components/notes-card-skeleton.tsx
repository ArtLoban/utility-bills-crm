import { cn } from "@/lib/utils";
import { SkeletonLine } from "@/components/skeleton-line";
import { SectionCard } from "@/components/section-card";
import { SectionCardHeaderSkeleton } from "@/components/section-card-header-skeleton";

const NOTE_LINE_WIDTHS = ["w-full", "w-4/5", "w-2/3"] as const;

export const NotesCardSkeleton = () => (
  <SectionCard className="h-full">
    <SectionCardHeaderSkeleton titleWidth="w-16" />

    <div className="px-4 pb-5 sm:px-5">
      {NOTE_LINE_WIDTHS.map((width, index) => (
        <SkeletonLine key={width} size="sm" className={cn(index === 0 ? "mt-4" : "mt-2", width)} />
      ))}
    </div>
  </SectionCard>
);
