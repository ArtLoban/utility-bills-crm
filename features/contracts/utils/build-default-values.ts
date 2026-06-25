import { CreateContractFormField } from "@/features/contracts/types";
import { type TCreateContractForm } from "@/features/contracts/schema";
import { todayIso } from "@/lib/format/date";

export const buildDefaultValues = (): TCreateContractForm => ({
  [CreateContractFormField.PROVIDER_ID]: "",
  [CreateContractFormField.VALID_FROM]: todayIso(),
  [CreateContractFormField.NOTES]: "",
});
