"use client";

import { useState } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";

import { RestoreDialog } from "@/features/admin-properties/components/restore-dialog";
import { HardDeleteDialog } from "@/features/admin-properties/components/hard-delete-dialog";

type TProps = {
  propertyId: string;
  propertyName: string;
  deletedAt: Date;
};

export const SoftDeleteBanner = ({ propertyId, propertyName, deletedAt }: TProps) => {
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [hardDeleteOpen, setHardDeleteOpen] = useState(false);

  return (
    <>
      <div className="border-destructive/20 border-l-destructive bg-destructive/5 flex flex-wrap items-start gap-4 rounded-lg border border-l-4 px-5 py-4">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <Trash2 size={18} strokeWidth={1.75} className="text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-destructive text-sm font-semibold">This property is deleted</p>
            <p className="text-muted-foreground mt-0.5 text-sm leading-snug">
              Soft-deleted on {format(deletedAt, "MMMM d, yyyy")}. Restore or permanently delete it
              below.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setRestoreOpen(true)}>
            <RotateCcw size={13} strokeWidth={1.75} />
            Restore
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setHardDeleteOpen(true)}>
            <Trash2 size={13} strokeWidth={1.75} />
            Delete permanently
          </Button>
        </div>
      </div>

      <RestoreDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        propertyId={propertyId}
        propertyName={propertyName}
      />
      <HardDeleteDialog
        open={hardDeleteOpen}
        onOpenChange={setHardDeleteOpen}
        propertyId={propertyId}
        propertyName={propertyName}
      />
    </>
  );
};
