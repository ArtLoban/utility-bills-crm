"use client";

import { useState, type ReactNode } from "react";

import type { TAdminPropertyRow } from "@/features/admin-properties/types";
import { RestoreDialog } from "@/features/admin-properties/components/restore-dialog";
import { HardDeleteDialog } from "@/features/admin-properties/components/hard-delete-dialog";

import { PropertiesTableProvider } from "../context";

type TProps = { children: ReactNode };

export const PropertiesTableActions = ({ children }: TProps) => {
  const [selectedRow, setSelectedRow] = useState<TAdminPropertyRow | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [hardDeleteOpen, setHardDeleteOpen] = useState(false);

  const openRestore = (row: TAdminPropertyRow) => {
    setSelectedRow(row);
    setRestoreOpen(true);
  };

  const openHardDelete = (row: TAdminPropertyRow) => {
    setSelectedRow(row);
    setHardDeleteOpen(true);
  };

  return (
    <PropertiesTableProvider value={{ openRestore, openHardDelete }}>
      {children}
      {selectedRow && (
        <>
          <RestoreDialog
            open={restoreOpen}
            onOpenChange={setRestoreOpen}
            propertyId={selectedRow.id}
            propertyName={selectedRow.name}
          />
          <HardDeleteDialog
            open={hardDeleteOpen}
            onOpenChange={setHardDeleteOpen}
            propertyId={selectedRow.id}
            propertyName={selectedRow.name}
          />
        </>
      )}
    </PropertiesTableProvider>
  );
};
