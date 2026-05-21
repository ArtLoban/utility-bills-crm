import { useState } from "react";

import { INITIAL_HOME } from "../constants";
import type { TFeatureCard, THomeContent } from "../types";

export const useHomeForm = () => {
  const [saved, setSaved] = useState<THomeContent>(INITIAL_HOME);
  const [form, setForm] = useState<THomeContent>(INITIAL_HOME);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = <K extends keyof THomeContent>(field: K, value: THomeContent[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setCard = (index: number, field: keyof TFeatureCard, value: string) =>
    setForm((prev) => ({
      ...prev,
      featureCards: prev.featureCards.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      ) as THomeContent["featureCards"],
    }));

  const save = () => setSaved(form);

  return { form, isDirty, set, setCard, save };
};
