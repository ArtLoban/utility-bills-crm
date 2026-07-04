import { describe, expect, it } from "vitest";

import { resolveServiceLabel, resolveServiceTypeLabel } from "../service-label";
import { SERVICE_TYPE_CODES, type TServiceTypeCode } from "../service-type";

// Minimal stand-in for the next-intl "services.types" translator.
const makeTranslator = (dict: Partial<Record<TServiceTypeCode, string>>) => {
  const t = ((code: TServiceTypeCode): string => dict[code] ?? code) as ((
    code: TServiceTypeCode,
  ) => string) & { has: (code: TServiceTypeCode) => boolean };
  t.has = (code: TServiceTypeCode): boolean => code in dict;
  return t;
};

describe("resolveServiceTypeLabel", () => {
  it("returns the translated type label when the key exists", () => {
    const t = makeTranslator({ [SERVICE_TYPE_CODES.ELECTRICITY]: "Electricity" });
    expect(resolveServiceTypeLabel(SERVICE_TYPE_CODES.ELECTRICITY, t)).toBe("Electricity");
  });

  it("falls back to the raw code when the translation is missing", () => {
    const t = makeTranslator({});
    expect(resolveServiceTypeLabel(SERVICE_TYPE_CODES.OTHER, t)).toBe(SERVICE_TYPE_CODES.OTHER);
  });
});

describe("resolveServiceLabel", () => {
  const t = makeTranslator({ [SERVICE_TYPE_CODES.ELECTRICITY]: "Electricity" });

  it("prefers the custom name when set", () => {
    expect(
      resolveServiceLabel({ name: "Garage meter", code: SERVICE_TYPE_CODES.ELECTRICITY }, t),
    ).toBe("Garage meter");
  });

  it("falls back to the type label when name is null", () => {
    expect(resolveServiceLabel({ name: null, code: SERVICE_TYPE_CODES.ELECTRICITY }, t)).toBe(
      "Electricity",
    );
  });

  it("falls back to the raw code when name is null and translation is missing", () => {
    expect(resolveServiceLabel({ name: null, code: SERVICE_TYPE_CODES.OTHER }, t)).toBe(
      SERVICE_TYPE_CODES.OTHER,
    );
  });
});
