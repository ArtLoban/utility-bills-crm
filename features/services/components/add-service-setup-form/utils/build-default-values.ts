import { type TServiceSetupForm } from "../schema";

export const buildDefaultValues = (): TServiceSetupForm => ({
  serviceTypeId: "",
  serviceNotes: "",
  providerId: "",
  contractValidFrom: "",
  contractNotes: "",
  tariffValidFrom: "",
  rateT1: "",
  rateT2: "",
  rateT3: "",
  fixedAmount: "",
  tariffNotes: "",
  meterEngaged: false,
  meter: {
    serialNumber: "",
    zoneCount: 1,
    installedAt: "",
    meterValidFrom: "",
    meterNotes: "",
  },
});
