import type { TReading } from "@/lib/db/schema/readings";
import { createSafeContext } from "@/lib/utils/create-safe-context";

type TReadingsTableContext = {
  requestDelete: (reading: TReading) => void;
};

export const [ReadingsTableContext, useReadingsTable] =
  createSafeContext<TReadingsTableContext>("ReadingsTable");
