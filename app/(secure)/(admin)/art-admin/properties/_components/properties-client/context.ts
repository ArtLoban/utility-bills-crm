import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TAdminPropertyRow } from "@/features/admin-properties/types";

type TPropertiesTableContext = {
  openRestore: (row: TAdminPropertyRow) => void;
  openHardDelete: (row: TAdminPropertyRow) => void;
};

export const [PropertiesTableProvider, usePropertiesTable] =
  createSafeContext<TPropertiesTableContext>("PropertiesTable");
