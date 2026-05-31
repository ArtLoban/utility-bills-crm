import { describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth";
import { ForbiddenError } from "@/lib/errors";
import { requireAdmin } from "../guards";

const mockAuth = (override: Partial<{ id: string; systemRole: string }> | null) => {
  if (override === null) {
    vi.mocked(auth).mockResolvedValue(null as unknown as Awaited<ReturnType<typeof auth>>);
    return;
  }
  vi.mocked(auth).mockResolvedValue({
    user: { id: "user-123", systemRole: "user", ...override },
  } as unknown as Awaited<ReturnType<typeof auth>>);
};

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
    expect(result.error).toBeInstanceOf(ForbiddenError);
  });

  it("returns err(ForbiddenError) for an anonymous caller (null session)", async () => {
    mockAuth(null);
    const result = await requireAdmin();
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBeInstanceOf(ForbiddenError);
  });
});
