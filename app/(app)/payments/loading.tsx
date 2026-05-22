// TODO(skeleton): wire PaymentsTableSkeleton with 200ms delay
// (UI_ARCHITECTURE.md → Loading feedback duration policy) once Server Components fetch replaces mock data.
import { ListPageSkeleton } from "@/components/list-page-skeleton";

export default function Loading() {
  return <ListPageSkeleton />;
}
