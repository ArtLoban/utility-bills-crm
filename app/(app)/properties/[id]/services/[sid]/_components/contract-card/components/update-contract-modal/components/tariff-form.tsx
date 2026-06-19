"use client";

import { subDays } from "date-fns";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/format/date";
import { UNIT_LABELS, ZONE_COLOR_VARS } from "@/lib/constants/zones";
import type { TServiceType } from "@/lib/db/schema/service-types";
import {
  FIELD_HINT_LABEL_CLASS,
  FIELD_INPUT_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_TEXTAREA_CLASS,
} from "../constants";
import { Callout } from "./callout";

type TTariffFormFields = {
  changeDate: string;
  setChangeDate: (v: string) => void;
  rateT1: string;
  setRateT1: (v: string) => void;
  rateT2: string;
  setRateT2: (v: string) => void;
  rateT3: string;
  setRateT3: (v: string) => void;
  fixedAmount: string;
  setFixedAmount: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
};

type TProps = { fields: TTariffFormFields; serviceType: TServiceType };

export const TariffForm = ({ fields, serviceType }: TProps) => {
  const t = useTranslations("services.detail.updateContract");
  const tRates = useTranslations("services.detail.contract.rates");

  const isMetered = serviceType.measurementType === "metered";
  const unitLabel = serviceType.unit ? UNIT_LABELS[serviceType.unit] : "";
  const perUnit = tRates("perUnit", { unit: unitLabel });

  const closing = fields.changeDate
    ? formatDisplayDate(subDays(new Date(fields.changeDate), 1))
    : null;
  const opening = fields.changeDate ? formatDisplayDate(new Date(fields.changeDate)) : null;

  const rates = [
    {
      value: fields.rateT1,
      set: fields.setRateT1,
      color: ZONE_COLOR_VARS[0],
      label: t("fields.t1"),
    },
    ...(serviceType.supportsZones
      ? [
          {
            value: fields.rateT2,
            set: fields.setRateT2,
            color: ZONE_COLOR_VARS[1],
            label: t("fields.t2"),
          },
          {
            value: fields.rateT3,
            set: fields.setRateT3,
            color: ZONE_COLOR_VARS[2],
            label: t("fields.t3"),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={FIELD_LABEL_CLASS}>{t("fields.effectiveFrom")}</label>
        <input
          type="date"
          value={fields.changeDate}
          onChange={(e) => fields.setChangeDate(e.target.value)}
          className={FIELD_INPUT_CLASS}
        />
      </div>

      {isMetered ? (
        <div>
          <label className={FIELD_HINT_LABEL_CLASS}>{t("fields.newRates")}</label>
          <div className="grid grid-cols-2 gap-3">
            {rates.map((rate, i) => (
              <div key={i}>
                <div className="text-muted-foreground mb-1 text-xs font-medium">{rate.label}</div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.0000"
                    value={rate.value}
                    onChange={(e) => rate.set(e.target.value)}
                    className="h-9 w-full rounded-md border pr-12 pl-2.5 text-sm tabular-nums outline-none"
                    style={{
                      borderColor: `color-mix(in srgb, ${rate.color} 50%, transparent)`,
                      background: `color-mix(in srgb, ${rate.color} 5%, transparent)`,
                    }}
                  />
                  <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                    {perUnit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className={FIELD_LABEL_CLASS}>{t("fields.monthlyAmount")}</label>
          <div className="relative max-w-40">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={fields.fixedAmount}
              onChange={(e) => fields.setFixedAmount(e.target.value)}
              className={cn(FIELD_INPUT_CLASS, "pr-12 tabular-nums")}
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
              {tRates("perMonth")}
            </span>
          </div>
        </div>
      )}

      <div>
        <label className={FIELD_HINT_LABEL_CLASS}>{t("fields.notesOptional")}</label>
        <textarea
          value={fields.notes}
          onChange={(e) => fields.setNotes(e.target.value)}
          rows={2}
          className={cn(FIELD_TEXTAREA_CLASS, "resize-none")}
        />
      </div>

      {closing && opening && (
        <Callout>
          {t.rich("callout.tariff", {
            closing,
            opening,
            b: (chunks) => <strong>{chunks}</strong>,
          })}
        </Callout>
      )}
    </div>
  );
};
