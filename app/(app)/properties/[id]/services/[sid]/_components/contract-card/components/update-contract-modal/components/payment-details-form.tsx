"use client";

import { subDays } from "date-fns";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/format/date";
import {
  FIELD_HINT_LABEL_CLASS,
  FIELD_INPUT_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_TEXTAREA_CLASS,
} from "../constants";
import { Callout } from "./callout";

type TPaymentDetailsFormFields = {
  details: string;
  setDetails: (v: string) => void;
  changeDate: string;
  setChangeDate: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
};

type TProps = { fields: TPaymentDetailsFormFields };

export const PaymentDetailsForm = ({ fields }: TProps) => {
  const t = useTranslations("services.detail.updateContract");
  const closing = fields.changeDate
    ? formatDisplayDate(subDays(new Date(fields.changeDate), 1))
    : null;
  const opening = fields.changeDate ? formatDisplayDate(new Date(fields.changeDate)) : null;

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

      <div>
        <label className={FIELD_LABEL_CLASS}>{t("fields.newPayment")}</label>
        <p className="text-muted-foreground mb-2 text-xs">{t("fields.paymentHint")}</p>
        <textarea
          value={fields.details}
          onChange={(e) => fields.setDetails(e.target.value)}
          rows={5}
          placeholder={t("fields.paymentPlaceholder")}
          className={cn(FIELD_TEXTAREA_CLASS, "resize-y font-mono leading-relaxed")}
        />
      </div>

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
          {t.rich("callout.payment", {
            closing,
            opening,
            b: (chunks) => <strong>{chunks}</strong>,
          })}
        </Callout>
      )}
    </div>
  );
};
