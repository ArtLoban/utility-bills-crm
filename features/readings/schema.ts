import { z } from "zod";

export const READING_LIMITS = {
  notes: 1000,
} as const;

// valueT1 arrives as a number from the hook (pre-parsed by the form).
const zoneValue = z.coerce
  .number({ message: "validation.zoneValue.invalid" })
  .nonnegative("validation.zoneValue.negative");

// Optional zones may arrive as:
//   - number   — from the hook (normal path)
//   - ""       — empty string from a form submission
//   - undefined — field absent
//   - "$undefined" — RSC serialization of undefined in server action payloads
// z.preprocess normalises all absent/empty cases to undefined before Zod sees the value.
const optionalZoneValue = z.preprocess(
  (v) => {
    if (v === "" || v === undefined || v === "$undefined") return undefined;
    if (typeof v === "string") return Number(v);
    return v;
  },
  z
    .number({ message: "validation.zoneValue.invalid" })
    .nonnegative("validation.zoneValue.negative")
    .optional(),
);

export const createReadingSchema = z.object({
  meterId: z.string().uuid("validation.meterId.invalid"),
  readAt: z.string().datetime({ offset: true, message: "validation.readAt.required" }),
  valueT1: zoneValue,
  valueT2: optionalZoneValue,
  valueT3: optionalZoneValue,
  notes: z
    .string()
    .trim()
    .max(READING_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const updateReadingSchema = z.object({
  readAt: z.string().datetime({ offset: true, message: "validation.readAt.required" }),
  valueT1: zoneValue,
  valueT2: optionalZoneValue,
  valueT3: optionalZoneValue,
  notes: z
    .string()
    .trim()
    .max(READING_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TCreateReadingInput = z.infer<typeof createReadingSchema>;
export type TUpdateReadingInput = z.infer<typeof updateReadingSchema>;
