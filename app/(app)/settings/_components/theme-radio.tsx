"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type TOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const OPTIONS: TOption[] = [
  { value: "light", label: "Light", icon: <Sun className="size-[14px]" /> },
  { value: "dark", label: "Dark", icon: <Moon className="size-[14px]" /> },
  { value: "system", label: "System", icon: <Monitor className="size-[14px]" /> },
];

const ThemeRadio = () => {
  const { theme, setTheme } = useTheme();
  const activeTheme = theme ?? "system";

  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTIONS.map((opt) => {
        const active = activeTheme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md border px-[14px] text-sm transition-colors duration-[120ms]",
              active
                ? "border-zinc-950 bg-zinc-950 font-medium text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                : "border-zinc-200 bg-white font-normal text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800",
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export { ThemeRadio };
