export const ProviderFormField = {
  NAME: "name",
  WEBSITE: "website",
  PHONE: "phone",
  NOTES: "notes",
} as const;

export type TProviderFormField = (typeof ProviderFormField)[keyof typeof ProviderFormField];
