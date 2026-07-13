import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PublicIntlProvider } from "@/components/public-intl-provider";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { DEFAULT_THEME } from "@/lib/theme/constants";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "./_components/public-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    template: "%s · Utility Bills CRM",
    default: "Utility Bills CRM",
  },
  description: "Personal utility bills tracker",
};

// Bridges the NEXT_THEME cookie into localStorage before next-themes' own script
// reads it, so a returning visitor's saved theme applies without a flash. Pure
// browser code (reads document.cookie) — no server cookie access, so the public
// shell stays statically prerenderable.
const themeCookieScript = `(function(){try{var m=document.cookie.match(/NEXT_THEME=([^;]+)/);if(!m)return;var v=m[1];if(v==="dark"||v==="light"){localStorage.setItem("theme",v)}else if(v==="system"){localStorage.removeItem("theme")}}catch(e){}})()`;

export default function PublicRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeCookieScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <PublicIntlProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme={DEFAULT_THEME}
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider delayDuration={300}>
              <div className="flex min-h-screen flex-col">
                <PublicHeader />
                <main className="flex flex-1 flex-col">{children}</main>
                <PublicFooter />
              </div>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </PublicIntlProvider>
      </body>
    </html>
  );
}
