"use client";

import { useState } from "react";
import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/section-card";
import { SubmitReadingModal } from "@/features/readings/components/submit-reading-modal";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TReading } from "@/lib/db/schema/readings";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  lastReading: TReading | null;
};

export const QuickActions = ({ meter, serviceType, propertyName, lastReading }: TProps) => {
  const [readingOpen, setReadingOpen] = useState(false);
  const t = useTranslations("services.detail.quickActions");

  return (
    <>
      <SectionCard>
        <div className="flex flex-wrap items-center gap-2 px-5 py-3.5">
          <span className="text-muted-foreground mr-2 text-sm">{t("title")}</span>
          <Button onClick={() => setReadingOpen(true)}>
            <Gauge className="size-3.5" />
            {t("submitReading")}
          </Button>
        </div>
      </SectionCard>

      <SubmitReadingModal
        open={readingOpen}
        onOpenChange={setReadingOpen}
        meter={meter}
        serviceType={serviceType}
        propertyName={propertyName}
        lastReading={lastReading}
      />
    </>
  );
};
