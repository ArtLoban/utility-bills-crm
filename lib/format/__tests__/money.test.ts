import { describe, expect, it } from "vitest";

import { formatMoney } from "../money";

// Intl uses a narrow / no-break space as the group separator in uk/ru — never a
// regular ASCII space. Normalize all whitespace to a plain space before asserting,
// so expected strings can be hand-typed without becoming flaky.
const normalize = (value: string): string => value.replace(/\s/g, " ");

describe("formatMoney", () => {
  describe("symbol: true (default)", () => {
    it("formats en with a leading ₴ glyph", () => {
      expect(normalize(formatMoney(1234.5, "en"))).toBe("₴1,234.50");
    });

    it("formats uk with a trailing ₴ glyph and space separators", () => {
      expect(normalize(formatMoney(1234.5, "uk"))).toBe("1 234,50 ₴");
    });

    it("formats ru with a trailing ₴ glyph and space separators", () => {
      expect(normalize(formatMoney(1234.5, "ru"))).toBe("1 234,50 ₴");
    });
  });

  describe("symbol: false", () => {
    it("formats en without a glyph", () => {
      expect(normalize(formatMoney(1234.5, "en", { symbol: false }))).toBe("1,234.50");
    });

    it("formats uk without a glyph", () => {
      expect(normalize(formatMoney(1234.5, "uk", { symbol: false }))).toBe("1 234,50");
    });

    it("formats ru without a glyph", () => {
      expect(normalize(formatMoney(1234.5, "ru", { symbol: false }))).toBe("1 234,50");
    });
  });

  it("renders negative amounts with a sign in both modes", () => {
    expect(normalize(formatMoney(-1234.5, "en"))).toBe("-₴1,234.50");
    expect(normalize(formatMoney(-1234.5, "en", { symbol: false }))).toBe("-1,234.50");
  });

  it("formats zero in both modes", () => {
    expect(normalize(formatMoney(0, "en"))).toBe("₴0.00");
    expect(normalize(formatMoney(0, "en", { symbol: false }))).toBe("0.00");
  });

  it("formats string input identically to numeric input", () => {
    expect(formatMoney("1234.50", "en")).toBe(formatMoney(1234.5, "en"));
    expect(formatMoney("1234.50", "uk", { symbol: false })).toBe(
      formatMoney(1234.5, "uk", { symbol: false }),
    );
  });
});
