"use client";

import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";

// Static English intl context for the public surface. Rendered from a client
// boundary so it uses next-intl's client provider — which takes locale/messages
// as props and makes no server calls. The RSC provider would await
// getTimeZone()/getConfigNow()/getFormats(), each reading cookies() and opting
// the whole public shell into dynamic rendering. Public is English-only, so the
// locale and messages are static and safe to bundle.
export const PublicIntlProvider = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={enMessages}>
    {children}
  </NextIntlClientProvider>
);
