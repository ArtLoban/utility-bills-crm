"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { TContractWithProvider } from "@/lib/db/access/contracts";
import type { TAttributeHistory } from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { ContractHistoryDrawer } from "./contract-history-drawer";

type TProps = {
  contractHistory: TContractWithProvider[];
  attributeHistory: TAttributeHistory;
};

export const ContractCardClient = ({ contractHistory, attributeHistory }: TProps) => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const t = useTranslations("services.detail.contract");

  return (
    <>
      <Button variant="outline" onClick={() => setHistoryOpen(true)}>
        <History className="size-3.5" />
        {t("viewHistory")}
      </Button>

      <ContractHistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={contractHistory}
        attributeHistory={attributeHistory}
      />
    </>
  );
};
