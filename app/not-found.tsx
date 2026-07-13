import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotFoundContent } from "@/components/not-found-content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "404 — Page not found",
};

// Global fallback for unmatched URLs. With no shared root layout it must render
// its own document; kept self-contained (no providers) like global-error.tsx.
// Applies the dark class from cookie/localStorage before paint to avoid a flash.
const themeScript = `(function(){var c=document.cookie.match(/NEXT_THEME=([^;]+)/)?.[1],l=localStorage.getItem('theme'),t=c||l;if(t==='dark')document.documentElement.classList.add('dark');})()`;

export default function NotFound() {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <NotFoundContent />
      </body>
    </html>
  );
}
