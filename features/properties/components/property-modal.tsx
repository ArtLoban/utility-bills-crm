"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { PropertyFormContent } from "./property-form-content";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";

type TProps = {
  property?: TPropertyDetail;
};

export const PropertyModal = ({ property }: TProps) => {
  const router = useRouter();
  const t = useTranslations("properties");

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t(property ? "modal.edit.title" : "modal.add.title")}</DialogTitle>
        </DialogHeader>
        <PropertyFormContent property={property} />
      </DialogContent>
    </Dialog>
  );
};
