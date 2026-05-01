"use client";

import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TProps = {
  children: ReactNode;
};

export const PublicHeaderShell = ({ children }: TProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 transition-all duration-200",
        scrolled
          ? "bg-background/88 border-b backdrop-blur-md"
          : "bg-background border-b border-transparent",
      )}
    >
      {children}
    </header>
  );
};
