export type TCreateAccountNumberFormState = {
  contractId: string;
  value: string;
  validFrom: string;
  validTo: string;
  notes: string;
};

export type TChangeAccountNumberFormState = {
  contractId: string;
  value: string;
  changeDate: string;
  notes: string;
};
