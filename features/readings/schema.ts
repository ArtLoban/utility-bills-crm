import { z } from "zod";

import { parseReadingValue } from "./utils/parse-value";

export const READING_LIMITS = {
  notes: 1000,
} as const;

// Error message keys are relative to the "readings" i18n namespace.

// valueT1 arrives as a number from the hook (pre-parsed by the form).
const zoneValue = z.coerce
  .number({ message: "validation.value.invalid" })
  .nonnegative("validation.value.negative");

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
    .number({ message: "validation.value.invalid" })
    .nonnegative("validation.value.negative")
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

// ----- Client form schema -----
// The form holds raw strings; values are parsed to numbers and readAt to a
// datetime-with-offset on submit (the action schema above re-validates the parsed
// payload). Zone requiredness depends on the meter's zoneCount, so the schema is built
// per meter — superRefine keeps a single, stable all-strings output shape.

const addNumericIssue = (
  ctx: z.RefinementCtx,
  field: string,
  value: string,
  required: boolean,
): void => {
  const trimmed = value.trim();
  if (trimmed === "") {
    if (required) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [field],
        message: "validation.value.required",
      });
    }
    return;
  }
  const parsed = parseReadingValue(trimmed);
  if (parsed === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [field],
      message: "validation.value.invalid",
    });
    return;
  }
  if (parsed < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [field],
      message: "validation.value.negative",
    });
  }
};

export const buildReadingFormSchema = (zoneCount: number) =>
  z
    .object({
      readAt: z.string().min(1, "validation.readAt.required"),
      valueT1: z.string(),
      valueT2: z.string(),
      valueT3: z.string(),
      notes: z.string().max(READING_LIMITS.notes, "validation.notes.tooLong"),
    })
    .superRefine((data, ctx) => {
      addNumericIssue(ctx, "valueT1", data.valueT1, true);
      addNumericIssue(ctx, "valueT2", data.valueT2, zoneCount >= 2);
      addNumericIssue(ctx, "valueT3", data.valueT3, zoneCount === 3);
    });

export type TReadingFormValues = z.infer<ReturnType<typeof buildReadingFormSchema>>;
