"use client";

import { type KeyboardEvent, useRef } from "react";

import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import type { TServiceTypeOption } from "../types";
import { ServiceTypeCard } from "./service-type-card";

type TProps = {
  value: string;
  onChange: (id: TServiceTypeId) => void;
  options: TServiceTypeOption[];
  addedBadgeLabel: string;
  ariaLabel: string;
};

export const ServiceTypeSelector = ({
  value,
  onChange,
  options,
  addedBadgeLabel,
  ariaLabel,
}: TProps) => {
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const enabledIndexes = options.flatMap((option, index) => (option.isDisabled ? [] : [index]));
  const selectedIndex = options.findIndex((option) => option.id === value && !option.isDisabled);
  const tabbableIndex = selectedIndex === -1 ? (enabledIndexes[0] ?? -1) : selectedIndex;

  const moveTo = (fromIndex: number, direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return;

    const currentPos = enabledIndexes.indexOf(fromIndex);
    const basePos = currentPos === -1 ? 0 : currentPos;
    const nextPos = (basePos + direction + enabledIndexes.length) % enabledIndexes.length;
    const nextIndex = enabledIndexes[nextPos];
    if (nextIndex === undefined) return;

    const nextOption = options[nextIndex];
    if (!nextOption) return;

    onChange(nextOption.id);
    cardsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveTo(index, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveTo(index, -1);
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
    >
      {options.map((option, index) => (
        <ServiceTypeCard
          key={option.id}
          ref={(element) => {
            cardsRef.current[index] = element;
          }}
          label={option.label}
          measurementLabel={option.measurementLabel}
          Icon={option.Icon}
          color={option.color}
          isSelected={value === option.id}
          isDisabled={option.isDisabled}
          addedBadgeLabel={addedBadgeLabel}
          tabIndex={index === tabbableIndex ? 0 : -1}
          onSelect={() => onChange(option.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        />
      ))}
    </div>
  );
};
