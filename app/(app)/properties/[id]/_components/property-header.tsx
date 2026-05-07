"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MoreHorizontal, Pencil, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PropertyModal } from "@/components/feature/properties/property-modal";
import { type TPropertyDetail } from "../../_data/mock";

type TProps = {
  property: TPropertyDetail;
};

const PropertyHeader = ({ property }: TProps) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="mb-2.5 flex items-center gap-1 text-sm">
        <Link
          href="/properties"
          className="text-zinc-500 no-underline hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Properties
        </Link>
        <ChevronRight size={14} className="text-zinc-200 dark:text-zinc-700" strokeWidth={2} />
        <span className="text-zinc-950 dark:text-zinc-50">{property.name}</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[28px] font-semibold tracking-[-0.6px] text-zinc-950 dark:text-zinc-50">
            {property.name}
          </h1>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-zinc-500">
            {property.address && <span>{property.address}</span>}
            {property.address && <span className="text-zinc-300 dark:text-zinc-700">·</span>}
            <span>{property.serviceCount} services</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>Created {property.createdAt}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {property.myRole === "owner" && (
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil size={13} />
              Edit
            </Button>
          )}
          <Button variant="outline" render={<Link href={`/properties/${property.id}/sharing`} />}>
            <Share2 size={13} />
            Share
          </Button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      <PropertyModal
        open={editOpen}
        onOpenChange={setEditOpen}
        property={{
          id: property.id,
          name: property.name,
          type: property.type,
          address: property.address,
          notes: property.notes,
        }}
      />
    </div>
  );
};

export { PropertyHeader };
