// Form state types for tariff mutations.
// Distinguish from DB row types (TTariff) — these are UI-layer, ephemeral.

export type TCreateTariffFormState = {
  contractId: string;
  validFrom: string;
  validTo: string;
  rateT1: string;
  rateT2: string;
  rateT3: string;
  fixedAmount: string;
  notes: string;
};

export type TChangeTariffFormState = {
  contractId: string;
  changeDate: string;
  rateT1: string;
  rateT2: string;
  rateT3: string;
  fixedAmount: string;
  notes: string;
};
