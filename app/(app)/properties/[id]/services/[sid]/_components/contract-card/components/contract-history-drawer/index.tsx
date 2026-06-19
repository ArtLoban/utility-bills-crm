"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
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
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-[520px] max-w-[520px] flex-col p-0"
      >
        <div className="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
          <SheetTitle className="text-md text-foreground font-semibold tracking-[-0.2px]">
            {t("title")}
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon-sm" aria-label={t("close")}>
              <X className="size-4" />
            </Button>
          </SheetClose>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
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

        <div className="border-border bg-muted/40 flex shrink-0 items-center border-t px-5 py-3.5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
