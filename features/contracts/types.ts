export const CreateContractFormField = {
  PROVIDER_ID: "providerId",
  VALID_FROM: "validFrom",
  NOTES: "notes",
} as const;

export type TChangeProviderFormState = {
  providerId: string;
  changeDate: string;
  notes: string;
};
