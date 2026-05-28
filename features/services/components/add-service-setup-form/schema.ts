import type { TCreateServiceWithSetupInput } from "@/features/services/schema";

// Form values mirror the action input exactly.
// meterEngaged is a UI-only flag — kept in local useState, not in the form schema.
export type TFormValues = TCreateServiceWithSetupInput;
