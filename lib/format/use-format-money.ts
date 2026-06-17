"use client";

import { useLocale } from "next-intl";
import { useCallback } from "react";

import { formatMoney, type TFormatMoneyOptions } from "./money";

export const useFormatMoney = () => {
  const locale = useLocale();

  return useCallback(
    (amount: string | number, opts?: TFormatMoneyOptions): string =>
      formatMoney(amount, locale, opts),
    [locale],
  );
};
