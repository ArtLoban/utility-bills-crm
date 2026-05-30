"use client";

import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALE_LIST, LOCALE_CONFIG, type TLocale } from "@/lib/locale/constants";
import { setLocale } from "@/lib/locale/actions";
import {
  FieldHint,
  FieldLabel,
  SettingsCard,
  SettingsCardBody,
  SettingsCardHeader,
} from "./settings-card";

const ThemeRadio = dynamic(() => import("./theme-radio").then((m) => m.ThemeRadio), {
  ssr: false,
});

type TNativeSelectProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const NativeSelect = ({ options, value, onChange, disabled }: TNativeSelectProps) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      disabled={disabled}
      className="h-9 w-full appearance-none rounded-md border border-zinc-200 bg-white py-0 pr-8 pl-3 text-sm text-zinc-950 transition-colors duration-[120ms] outline-none focus:border-violet-600 focus:ring-3 focus:ring-violet-600/20 disabled:cursor-default disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-violet-500 dark:focus:ring-violet-500/20 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
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

const LANGUAGE_OPTIONS = LOCALE_LIST.map((l) => ({ value: l, label: LOCALE_CONFIG[l].label }));

const PreferencesSection = () => {
  const t = useTranslations("settings.preferences");
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLocaleChange = async (locale: string) => {
    await setLocale(locale as TLocale);
    router.refresh();
  };

  return (
    <SettingsCard>
      <SettingsCardHeader title={t("title")} description={t("description")} />
      <SettingsCardBody>
        {/* Language */}
        <div>
          <FieldLabel>{t("language.label")}</FieldLabel>
          <NativeSelect
            options={LANGUAGE_OPTIONS}
            value={currentLocale}
            onChange={handleLocaleChange}
          />
          <FieldHint>{t("language.hint")}</FieldHint>
        </div>

        {/* Theme */}
        <div>
          <FieldLabel>{t("theme.label")}</FieldLabel>
          <ThemeRadio />
        </div>

        {/* Timezone */}
        <div>
          <FieldLabel>{t("timezone.label")}</FieldLabel>
          <NativeSelect
            options={[{ value: "kyiv", label: "Europe/Kyiv (UTC+2)" }]}
            value="kyiv"
            disabled
          />
          <FieldHint>{t("timezone.hint")}</FieldHint>
        </div>
      </SettingsCardBody>
    </SettingsCard>
  );
};

export { PreferencesSection };
