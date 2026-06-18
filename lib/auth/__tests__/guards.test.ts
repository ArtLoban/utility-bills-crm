import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ERROR_CODES } from "@/lib/errors";
import { requireAdmin, requireMutableUser, requireSession, requireUser } from "../guards";

// Mimic the real next/navigation redirect: it never returns (throws NEXT_REDIRECT
// internally). Throwing a sentinel here both halts execution like the real one and
// lets tests assert the bounce target.
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

const LOGIN_BOUNCE = "/login?reason=session-expired";

type TUserOverride = Partial<{ id: string; systemRole: string; isDemo: boolean }>;

const mockAuth = (override: TUserOverride | null) => {
  if (override === null) {
    vi.mocked(auth).mockResolvedValue(null as unknown as Awaited<ReturnType<typeof auth>>);
    return;
  }
  vi.mocked(auth).mockResolvedValue({
    user: { id: "user-123", systemRole: "user", isDemo: false, ...override },
  } as unknown as Awaited<ReturnType<typeof auth>>);
};

beforeEach(() => {
  vi.mocked(redirect).mockClear();
});

describe("requireUser", () => {
  it("returns the caller's userId for a valid session", async () => {
    mockAuth({ id: "user-abc" });
    await expect(requireUser()).resolves.toBe("user-abc");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to login with the session-expired reason when there is no session", async () => {
    mockAuth(null);
    await expect(requireUser()).rejects.toThrow(`REDIRECT:${LOGIN_BOUNCE}`);
    expect(redirect).toHaveBeenCalledWith(LOGIN_BOUNCE);
  });
});

describe("requireSession", () => {
  it("returns the enriched user for a valid session", async () => {
    mockAuth({ id: "user-abc", isDemo: true });
    const user = await requireSession();
    expect(user.id).toBe("user-abc");
    expect(user.isDemo).toBe(true);
  });

  it("redirects to login when there is no session", async () => {
    mockAuth(null);
    await expect(requireSession()).rejects.toThrow(`REDIRECT:${LOGIN_BOUNCE}`);
    expect(redirect).toHaveBeenCalledWith(LOGIN_BOUNCE);
  });
});

describe("requireMutableUser", () => {
  it("returns ok with userId for a non-demo authenticated caller", async () => {
    mockAuth({ id: "user-abc", isDemo: false });
    const result = await requireMutableUser();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBe("user-abc");
  });

  it("returns err(DemoModeError) for a demo caller", async () => {
    mockAuth({ id: "demo-1", isDemo: true });
    const result = await requireMutableUser();
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("redirects to login when there is no session", async () => {
    mockAuth(null);
    await expect(requireMutableUser()).rejects.toThrow(`REDIRECT:${LOGIN_BOUNCE}`);
    expect(redirect).toHaveBeenCalledWith(LOGIN_BOUNCE);
  });
});

describe("requireAdmin", () => {
  it("returns ok with userId for an admin caller", async () => {
    mockAuth({ id: "admin-abc", systemRole: "admin" });
    const result = await requireAdmin();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBe("admin-abc");
  });

  it("returns err(ForbiddenError) for an authenticated non-admin", async () => {
    mockAuth({ id: "user-123", systemRole: "user" });
    const result = await requireAdmin();
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.FORBIDDEN);
  });

  it("returns err(ForbiddenError) for an anonymous caller (null session)", async () => {
    mockAuth(null);
    const result = await requireAdmin();
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.FORBIDDEN);
  });
});
