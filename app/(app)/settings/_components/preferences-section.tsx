"use client";

import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALE_CONFIG, getAvailableLocales, type TLocale } from "@/lib/locale/constants";
import { setLocale, setRuLocaleEnabled } from "@/lib/locale/actions";
import { Switch } from "@/components/ui/switch";
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

type TProps = {
  ruLocaleEnabled: boolean;
};

const PreferencesSection = ({ ruLocaleEnabled }: TProps) => {
  const t = useTranslations("settings.preferences");
  const router = useRouter();
  const currentLocale = useLocale();

  const availableLocales = getAvailableLocales({
    ruEnabled: ruLocaleEnabled,
    activeLocale: currentLocale as TLocale,
  });
  const languageOptions = availableLocales.map((l) => ({
    value: l,
    label: LOCALE_CONFIG[l].label,
  }));

  const handleLocaleChange = async (locale: string) => {
    await setLocale(locale as TLocale);
    router.refresh();
  };

  const handleRuLocaleToggle = async (enabled: boolean) => {
    await setRuLocaleEnabled(enabled);
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
            options={languageOptions}
            value={currentLocale}
            onChange={handleLocaleChange}
          />
          <FieldHint>{t("language.hint")}</FieldHint>
          <label className="mt-3 flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {t("language.showRussian")}
            </span>
            <Switch checked={ruLocaleEnabled} onCheckedChange={handleRuLocaleToggle} />
          </label>
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
