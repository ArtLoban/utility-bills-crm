import { useState } from "react";

import { INITIAL_ABOUT } from "../constants";
import type { TAboutContent } from "../types";

export const useAboutForm = () => {
  const [saved, setSaved] = useState<TAboutContent>(INITIAL_ABOUT);
  const [form, setForm] = useState<TAboutContent>(INITIAL_ABOUT);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = <K extends keyof TAboutContent>(field: K, value: TAboutContent[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const save = () => setSaved(form);

  return { form, isDirty, set, save };
};
