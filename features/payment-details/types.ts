export type TCreatePaymentDetailsFormState = {
  contractId: string;
  details: string;
  validFrom: string;
  validTo: string;
  notes: string;
};

export type TChangePaymentDetailsFormState = {
  contractId: string;
  details: string;
  changeDate: string;
  notes: string;
};
