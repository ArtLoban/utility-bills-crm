import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import "./globals.css";
import { auth } from "@/lib/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { THEME_COOKIE_NAME, DEFAULT_THEME, type TTheme } from "@/lib/theme/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utility Bills CRM",
  description: "Personal utility bills tracker",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [locale, messages, cookieStore, session] = await Promise.all([
    getLocale(),
    getMessages(),
    cookies(),
    auth(),
  ]);

  const cookieTheme = cookieStore.get(THEME_COOKIE_NAME)?.value as TTheme | undefined;
  const resolvedTheme: TTheme = cookieTheme ?? session?.user?.theme ?? DEFAULT_THEME;

  // Syncs localStorage.theme with the server-resolved theme before next-themes'
  // own script reads it. Prevents FOUC when a logged-in user reloads the page.
  const themeSyncScript = `(function(){var s="${resolvedTheme}",c=document.cookie.match(/NEXT_THEME=([^;]+)/)?.[1],t=c||s;if(!t||t==="system"){localStorage.removeItem("theme")}else{localStorage.setItem("theme",t)}})()`;

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeSyncScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme={resolvedTheme}
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider delayDuration={300}>
              <NuqsAdapter>{children}</NuqsAdapter>
            </TooltipProvider>
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
