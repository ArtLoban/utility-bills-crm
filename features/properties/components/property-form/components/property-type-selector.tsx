"use client";

import { type KeyboardEvent, useRef } from "react";
import { useTranslations } from "next-intl";

import type { TPropertyType } from "@/lib/db/schema/properties";
import { PROPERTY_TYPE_OPTIONS } from "@/features/properties/property-type";
import { PropertyTypeCard } from "./property-type-card";

type TProps = {
  value: TPropertyType | undefined;
  onChange: (value: TPropertyType) => void;
};

export const PropertyTypeSelector = ({ value, onChange }: TProps) => {
  const t = useTranslations("properties");
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedIndex = PROPERTY_TYPE_OPTIONS.findIndex((option) => option.value === value);
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const moveTo = (index: number) => {
    const count = PROPERTY_TYPE_OPTIONS.length;
    const nextIndex = (index + count) % count;
    const nextOption = PROPERTY_TYPE_OPTIONS[nextIndex];
    if (!nextOption) return;
    onChange(nextOption.value);
    cardsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveTo(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveTo(index - 1);
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={t("fields.type.label")}
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      {PROPERTY_TYPE_OPTIONS.map(({ value: optionValue, Icon }, index) => (
        <PropertyTypeCard
          key={optionValue}
          ref={(element) => {
            cardsRef.current[index] = element;
          }}
          label={t(`type.${optionValue}`)}
          Icon={Icon}
          isSelected={value === optionValue}
          tabIndex={index === tabbableIndex ? 0 : -1}
          onSelect={() => onChange(optionValue)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        />
      ))}
    </div>
  );
};
