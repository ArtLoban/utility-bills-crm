"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { UpdateContractModal } from "@/features/contracts/components/update-contract-modal";

type TProps = {
  contractId: TContractId;
  serviceId: TServiceId;
  serviceType: TServiceType;
  propertyId: string;
};

export const UpdateContractButton = ({
  contractId,
  serviceId,
  serviceType,
  propertyId,
}: TProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("services.detail.contract");

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Settings2 className="size-3.5" />
        {t("updateContract")}
      </Button>

      <UpdateContractModal
        open={open}
        onOpenChange={setOpen}
        contractId={contractId}
        serviceId={serviceId}
        serviceType={serviceType}
        propertyId={propertyId}
      />
    </>
  );
};
