"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALE_CONFIG, getAvailableLocales, type TLocale } from "@/lib/locale/constants";
import { setLocale, setRuLocaleEnabled } from "@/lib/locale/actions";
import { Switch } from "@/components/ui/switch";
import { FieldHint, FieldLabel, SettingsCardBody, SettingsCardHeader } from "./settings-card";
import { PreferenceSelect } from "./preference-select";
import { Surface } from "@/components/surface";

const ThemeRadio = dynamic(() => import("./theme-radio").then((m) => m.ThemeRadio), {
  ssr: false,
});

type TProps = {
  ruLocaleEnabled: boolean;
};

export const PreferencesSection = ({ ruLocaleEnabled }: TProps) => {
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
    <Surface>
      <SettingsCardHeader title={t("title")} description={t("description")} />
      <SettingsCardBody>
        <div>
          <FieldLabel htmlFor="settings-language">{t("language.label")}</FieldLabel>
          <PreferenceSelect
            id="settings-language"
            options={languageOptions}
            value={currentLocale}
            onValueChange={handleLocaleChange}
          />
          <FieldHint>{t("language.hint")}</FieldHint>
          <label className="mt-3 flex cursor-pointer items-center justify-between gap-3">
            <span className="text-foreground text-sm">{t("language.showRussian")}</span>
            <Switch checked={ruLocaleEnabled} onCheckedChange={handleRuLocaleToggle} />
          </label>
        </div>

        <div>
          <FieldLabel>{t("theme.label")}</FieldLabel>
          <ThemeRadio />
        </div>

        <div>
          <FieldLabel htmlFor="settings-timezone">{t("timezone.label")}</FieldLabel>
          <PreferenceSelect
            id="settings-timezone"
            options={[{ value: "kyiv", label: "Europe/Kyiv (UTC+2)" }]}
            value="kyiv"
            disabled
          />
          <FieldHint>{t("timezone.hint")}</FieldHint>
        </div>
      </SettingsCardBody>
    </Surface>
  );
};
