import type { TMeter } from "@/lib/db/schema/meters";
import type { TReplaceMeterFormValues } from "../schema";
import { ReplaceMeterFormField } from "../types";

export const buildReplaceDefaultValues = (meter: TMeter): TReplaceMeterFormValues => ({
  [ReplaceMeterFormField.REPLACEMENT_DATE]: "",
  [ReplaceMeterFormField.SERIAL_NUMBER]: "",
  [ReplaceMeterFormField.ZONE_COUNT]: String(
    meter.zoneCount,
  ) as TReplaceMeterFormValues["zoneCount"],
  [ReplaceMeterFormField.INSTALLED_AT]: "",
  [ReplaceMeterFormField.NOTES]: "",
});
