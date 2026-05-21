import { useState } from "react";

import { INITIAL_PROJECT } from "../constants";
import type { TFeatureCard, TProjectContent } from "../types";

export const useProjectForm = () => {
  const [saved, setSaved] = useState<TProjectContent>(INITIAL_PROJECT);
  const [form, setForm] = useState<TProjectContent>(INITIAL_PROJECT);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = <K extends keyof TProjectContent>(field: K, value: TProjectContent[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setCard = (index: number, field: keyof TFeatureCard, value: string) =>
    setForm((prev) => ({
      ...prev,
      archCards: prev.archCards.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      ) as TProjectContent["archCards"],
    }));

  const save = () => setSaved(form);

  return { form, isDirty, set, setCard, save };
};
