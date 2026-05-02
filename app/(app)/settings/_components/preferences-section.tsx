"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";

import {
  FieldHint,
  FieldLabel,
  SettingsCard,
  SettingsCardBody,
  SettingsCardFooter,
  SettingsCardHeader,
} from "./settings-card";

const ThemeRadio = dynamic(() => import("./theme-radio").then((m) => m.ThemeRadio), {
  ssr: false,
});

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "uk", label: "Українська" },
  { value: "ru", label: "Русский" },
];

const NativeSelect = ({
  options,
  value,
  onChange,
  disabled,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      disabled={disabled}
      className="h-9 w-full appearance-none rounded-md border border-zinc-200 bg-white py-0 pr-8 pl-3 text-[13.5px] text-zinc-950 transition-colors duration-[120ms] outline-none focus:border-violet-600 focus:ring-3 focus:ring-violet-600/20 disabled:cursor-default disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-violet-500 dark:focus:ring-violet-500/20 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-400">
      <ChevronDown className="size-[14px]" />
    </span>
  </div>
);

const PreferencesSection = () => {
  const [language, setLanguage] = useState("en");
  const [savedLanguage, setSavedLanguage] = useState("en");
  const dirty = language !== savedLanguage;

  const handleSave = () => setSavedLanguage(language);

  return (
    <SettingsCard>
      <SettingsCardHeader
        title="Preferences"
        description="How the app looks and behaves for you."
      />
      <SettingsCardBody>
        {/* Language */}
        <div>
          <FieldLabel>Language</FieldLabel>
          <NativeSelect options={LANGUAGE_OPTIONS} value={language} onChange={setLanguage} />
          <FieldHint>The language of the app interface.</FieldHint>
        </div>

        {/* Theme */}
        <div>
          <FieldLabel>Theme</FieldLabel>
          <ThemeRadio />
        </div>

        {/* Timezone */}
        <div>
          <FieldLabel>Timezone</FieldLabel>
          <NativeSelect
            options={[{ value: "kyiv", label: "Europe/Kyiv (UTC+2)" }]}
            value="kyiv"
            disabled
          />
          <FieldHint>
            Timezone selection comes in a future release. Times are shown in Europe/Kyiv for now.
          </FieldHint>
        </div>
      </SettingsCardBody>
      <SettingsCardFooter>
        <Button disabled={!dirty} onClick={handleSave} style={{ height: 36 }}>
          Save changes
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  );
};

export { PreferencesSection };
