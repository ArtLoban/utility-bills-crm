import Link from "next/link";
import { Trash2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type TProps = {
  propertyId: string;
  deletedAt: string;
};

export const SoftDeleteBanner = ({ propertyId, deletedAt }: TProps) => (
  <div className="border-destructive/20 border-l-destructive bg-destructive/5 flex flex-wrap items-start gap-4 rounded-lg border border-l-4 px-5 py-4">
    <div className="flex min-w-0 flex-1 items-start gap-3.5">
      <Trash2 size={18} strokeWidth={1.75} className="text-destructive mt-0.5 shrink-0" />
      <div>
        <p className="text-destructive text-sm font-semibold">This property is soft-deleted</p>
        <p className="text-muted-foreground mt-0.5 text-sm leading-snug">
          Soft-deleted on {deletedAt}. The owner sees this property as gone. You can restore it or
          delete it permanently.
        </p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/art-admin/properties/${propertyId}/restore`}>
          <RotateCcw size={13} strokeWidth={1.75} />
          Restore
        </Link>
      </Button>
      <Button asChild variant="destructive" size="sm">
        <Link href={`/art-admin/properties/${propertyId}/hard-delete`}>
          <Trash2 size={13} strokeWidth={1.75} />
          Delete permanently
        </Link>
      </Button>
    </div>
  </div>
);
