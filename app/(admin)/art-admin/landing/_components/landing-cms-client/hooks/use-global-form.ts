import { useState } from "react";

import { INITIAL_GLOBAL } from "../constants";
import type { TGlobalContent } from "../types";

export const useGlobalForm = () => {
  const [saved, setSaved] = useState<TGlobalContent>(INITIAL_GLOBAL);
  const [form, setForm] = useState<TGlobalContent>(INITIAL_GLOBAL);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = <K extends keyof TGlobalContent>(field: K, value: TGlobalContent[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const save = () => setSaved(form);

  return { form, isDirty, set, save };
};
