"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { TContractWithProvider } from "@/lib/db/access/contracts";
import type { TAttributeHistory } from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { TimelineEntry } from "./components/timeline-entry";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: TContractWithProvider[];
  attributeHistory: TAttributeHistory;
};

export const ContractHistoryDrawer = ({
  open,
  onOpenChange,
  history,
  attributeHistory,
}: TProps) => {
  const t = useTranslations("services.detail.history");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle className="text-md">{t("title")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-4 pl-3">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("empty")}</p>
          ) : (
            history.map((item, i) => (
              <TimelineEntry
                key={item.contract.id}
                item={item}
                isLast={i === history.length - 1}
                tariffs={attributeHistory.tariffsByContract[item.contract.id] ?? []}
                accountNumbers={attributeHistory.accountNumbersByContract[item.contract.id] ?? []}
                paymentDetails={attributeHistory.paymentDetailsByContract[item.contract.id] ?? []}
              />
            ))
          )}
        </div>
        <SheetFooter className="bg-muted/40 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
