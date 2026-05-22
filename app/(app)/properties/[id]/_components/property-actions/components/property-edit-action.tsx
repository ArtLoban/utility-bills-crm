import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";

type TProps = { property: TPropertyDetail };

export const PropertyEditAction = ({ property }: TProps) => {
  if (property.role !== "owner") return null;

  return (
    <Button variant="outline" asChild>
      <Link href={`/properties/${property.id}/edit`}>
        <Pencil size={13} />
        Edit
      </Link>
    </Button>
  );
};
