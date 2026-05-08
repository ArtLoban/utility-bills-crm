import { Button } from "@/components/ui/button";
import { MoreHorizontal, Share2 } from "lucide-react";
import Link from "next/link";
import { TPropertyDetail } from "@/app/(app)/properties/_data/mock";
import { ROUTES } from "@/lib/routes";
import { PropertyEditAction } from "./components/property-edit-action";

type TProps = {
  property: TPropertyDetail;
};

export const PropertyActions = ({ property }: TProps) => (
  <div className="flex shrink-0 items-center gap-2">
    <PropertyEditAction property={property} />
    <Button
      variant="outline"
      render={<Link href={`${ROUTES.properties}/${property.id}/sharing`} />}
    >
      <Share2 size={13} />
      Share
    </Button>
    <Button variant="outline" className="h-8 w-8">
      <MoreHorizontal size={15} />
    </Button>
  </div>
);
