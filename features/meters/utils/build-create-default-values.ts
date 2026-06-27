import type { TCreateMeterFormValues } from "../schema";
import { CreateMeterFormField } from "../types";

export const buildCreateDefaultValues = (): TCreateMeterFormValues => ({
  [CreateMeterFormField.SERVICE_TYPE_ID]: "",
  [CreateMeterFormField.SERIAL_NUMBER]: "",
  [CreateMeterFormField.ZONE_COUNT]: "1",
  [CreateMeterFormField.INSTALLED_AT]: "",
  [CreateMeterFormField.VALID_FROM]: "",
  [CreateMeterFormField.NOTES]: "",
});
