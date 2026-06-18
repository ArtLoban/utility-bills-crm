import { describe, expect, it } from "vitest";

import {
  appError,
  DemoModeError,
  ERROR_CODES,
  errorMessage,
  ForbiddenError,
  NotFoundError,
  shouldHideAsNotFound,
  toThrowable,
  ValidationError,
} from "@/lib/errors";

// The bug this whole model exists to prevent: React Flight strips Error instances
// to a bare tag in production when they cross the Server Action → client boundary
// (`instanceof Error → "$Z"`), losing name/message/fields. A returned error must
// therefore be PLAIN DATA. These tests lock that contract so it can't regress.
// See `.claude/instructions/action-error-serialization.md`.

describe("appError factories — serialization-safe contract", () => {
  it("never produce Error instances (would be stripped in prod)", () => {
    expect(appError.demo()).not.toBeInstanceOf(Error);
    expect(appError.validation("x")).not.toBeInstanceOf(Error);
    expect(appError.notFound("bill", "id")).not.toBeInstanceOf(Error);
    expect(appError.forbidden()).not.toBeInstanceOf(Error);
  });

  it("are plain JSON-round-trippable objects (survive the RSC boundary)", () => {
    const e = appError.notFound("bill", "abc");
    expect(JSON.parse(JSON.stringify(e))).toEqual(e);
  });

  it("carry the discriminant code and payload", () => {
    expect(appError.demo()).toEqual({ code: ERROR_CODES.DEMO_MODE });
    expect(appError.validation("bad")).toEqual({ code: ERROR_CODES.VALIDATION, message: "bad" });
    expect(appError.notFound("bill", "id")).toEqual({
      code: ERROR_CODES.NOT_FOUND,
      entity: "bill",
      id: "id",
    });
    expect(appError.forbidden("no")).toEqual({ code: ERROR_CODES.FORBIDDEN, message: "no" });
  });
});

describe("shouldHideAsNotFound", () => {
  it("hides NOT_FOUND and FORBIDDEN (404-masking per #108)", () => {
    expect(shouldHideAsNotFound(appError.notFound("bill"))).toBe(true);
    expect(shouldHideAsNotFound(appError.forbidden())).toBe(true);
  });

  it("does not hide VALIDATION or DEMO_MODE", () => {
    expect(shouldHideAsNotFound(appError.validation("x"))).toBe(false);
    expect(shouldHideAsNotFound(appError.demo())).toBe(false);
  });
});

describe("toThrowable — reconstructs a real Error at the throw boundary", () => {
  it("maps each code to its DomainError subclass (for pino + Sentry)", () => {
    expect(toThrowable(appError.notFound("bill", "id"))).toBeInstanceOf(NotFoundError);
    expect(toThrowable(appError.forbidden())).toBeInstanceOf(ForbiddenError);
    expect(toThrowable(appError.validation("x"))).toBeInstanceOf(ValidationError);
    expect(toThrowable(appError.demo())).toBeInstanceOf(DemoModeError);
  });

  it("preserves the message", () => {
    expect(toThrowable(appError.validation("bad input")).message).toBe("bad input");
    expect(toThrowable(appError.notFound("bill", "id")).message).toBe('bill "id" not found');
  });
});

describe("errorMessage", () => {
  it("returns the message for message-bearing codes", () => {
    expect(errorMessage(appError.validation("oops"))).toBe("oops");
    expect(errorMessage(appError.forbidden("denied"))).toBe("denied");
  });

  it("returns null when no message is present", () => {
    expect(errorMessage(appError.demo())).toBeNull();
    expect(errorMessage(appError.notFound("bill"))).toBeNull();
    expect(errorMessage(appError.forbidden())).toBeNull();
  });
});
