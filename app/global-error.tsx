"use client";

// CSS must be imported here directly — root layout is bypassed when this renders
import "./globals.css";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/icon-badge";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Restores theme class without ThemeProvider: reads NEXT_THEME cookie or localStorage.theme
const themeScript = `(function(){var c=document.cookie.match(/NEXT_THEME=([^;]+)/)?.[1],l=localStorage.getItem('theme'),t=c||l;if(t==='dark')document.documentElement.classList.add('dark');})()`;

type TProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: TProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <title>Something went wrong</title>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center md:pb-[80px]">
          <IconBadge icon={TriangleAlert} color="var(--destructive)" size="lg" />

          <h2 className="mt-6 text-xl font-semibold tracking-tight md:text-2xl">
            Something went wrong
          </h2>

          <p className="text-muted-foreground mt-2.5 max-w-xs text-sm leading-relaxed md:max-w-md">
            We&apos;ve been notified and are looking into it. Try again, or head back home.
          </p>

          <div className="mt-6 flex w-full max-w-72 flex-col-reverse gap-2.5 md:w-auto md:max-w-none md:flex-row md:gap-3">
            <Button asChild variant="outline" className="h-11 w-full md:h-9 md:w-auto">
              <Link href="/">Go home</Link>
            </Button>
            <Button variant="default" className="h-11 w-full md:h-9 md:w-auto" onClick={reset}>
              Try again
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
