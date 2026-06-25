"use client";

import { subDays } from "date-fns";
import { useTranslations } from "next-intl";

import { formatDisplayDate } from "@/lib/format/date";
import { UPDATE_CONTRACT_NAMESPACE } from "../constants";
import { Callout } from "./callout";

type TProps = {
  changeDate: string;
  messageKey: "callout.tariff" | "callout.account" | "callout.payment";
};

export const ChangeCallout = ({ changeDate, messageKey }: TProps) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  if (!changeDate) return null;

  const closing = formatDisplayDate(subDays(new Date(changeDate), 1));
  const opening = formatDisplayDate(new Date(changeDate));

  return (
    <Callout>
      {t.rich(messageKey, { closing, opening, b: (chunks) => <strong>{chunks}</strong> })}
    </Callout>
  );
};
