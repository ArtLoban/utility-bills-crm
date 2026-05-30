"use client";

import { useTranslations } from "next-intl";
import { TYPE_OPTIONS } from "@/features/properties/constants";
import type { TPropertyType } from "@/lib/db/schema/properties";

type TProps = {
  value: TPropertyType | "";
  onChange: (value: TPropertyType) => void;
};

export const PropertyTypeSelector = ({ value, onChange }: TProps) => {
  const t = useTranslations("properties");

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-950 dark:text-zinc-50">
        {t("fields.type.label")}
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TYPE_OPTIONS.map(({ value: optionValue, Icon }) => {
          const isSelected = value === optionValue;
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
              className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 transition-[border-color,background-color] duration-150"
              style={{
                border: `1px solid ${isSelected ? "var(--field-tint-border)" : "var(--type-card-border)"}`,
                background: isSelected ? "var(--field-tint-bg)" : "var(--type-card-bg)",
              }}
            >
              <Icon
                size={20}
                style={{ color: isSelected ? "var(--field-tint-fg)" : "var(--muted-foreground)" }}
              />
              <span
                className={isSelected ? "text-xs font-medium" : "text-xs font-normal"}
                style={{ color: isSelected ? "var(--field-tint-fg)" : "var(--muted-foreground)" }}
              >
                {t(`type.${optionValue}` as `type.${TPropertyType}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
