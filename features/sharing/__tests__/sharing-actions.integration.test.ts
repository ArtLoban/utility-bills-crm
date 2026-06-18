import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { and, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { ERROR_CODES, errorMessage } from "@/lib/errors";
import { auth } from "@/lib/auth";
import {
  inviteToProperty,
  changePropertyRole,
  removePropertyAccess,
  leaveProperty,
} from "../actions";

// --- Fixtures ---

let ownerUserId: UserId;
let editorUserId: UserId;
let viewerUserId: UserId;
let secondOwnerUserId: UserId;
let inviteeUserId: UserId;
let testPropertyId: PropertyId;

const mockAuth = (userId: UserId) =>
  vi
    .mocked(auth)
    .mockResolvedValue({ user: { id: userId } } as unknown as Awaited<ReturnType<typeof auth>>);

// --- beforeAll: insert durable test users and the test property ---

beforeAll(async () => {
  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "test-sharing-owner@test.invalid", name: "Sharing Owner" },
      { email: "test-sharing-editor@test.invalid", name: "Sharing Editor" },
      { email: "test-sharing-viewer@test.invalid", name: "Sharing Viewer" },
      { email: "test-sharing-second-owner@test.invalid", name: "Sharing Second Owner" },
      { email: "test-sharing-invitee@test.invalid", name: "Sharing Invitee" },
    ])
    .returning({ id: users.id });

  ownerUserId = insertedUsers[0]!.id;
  editorUserId = insertedUsers[1]!.id;
  viewerUserId = insertedUsers[2]!.id;
  secondOwnerUserId = insertedUsers[3]!.id;
  inviteeUserId = insertedUsers[4]!.id;

  const [property] = await db
    .insert(properties)
    .values({ name: "Test Sharing Property", type: "apartment" })
    .returning({ id: properties.id });
  testPropertyId = property!.id;
});

// --- beforeEach: reset propertyAccess to canonical initial state ---
// Hard-delete (not soft-delete) so the partial unique index allows clean re-inserts.
// Initial state: owner=ownerUserId, editor=editorUserId, viewer=viewerUserId.
// secondOwnerUserId and inviteeUserId have NO access row.

beforeEach(async () => {
  await db.delete(propertyAccess).where(eq(propertyAccess.propertyId, testPropertyId));
  await db.insert(propertyAccess).values([
    {
      propertyId: testPropertyId,
      userId: ownerUserId,
      propertyRole: "owner",
      grantedBy: ownerUserId,
    },
    {
      propertyId: testPropertyId,
      userId: editorUserId,
      propertyRole: "editor",
      grantedBy: ownerUserId,
    },
    {
      propertyId: testPropertyId,
      userId: viewerUserId,
      propertyRole: "viewer",
      grantedBy: ownerUserId,
    },
  ]);
});

// --- afterAll: delete property (FK cascade removes access rows) and test users ---

afterAll(async () => {
  await db.delete(properties).where(eq(properties.id, testPropertyId));
  await db
    .delete(users)
    .where(
      inArray(users.id, [
        ownerUserId,
        editorUserId,
        viewerUserId,
        secondOwnerUserId,
        inviteeUserId,
      ]),
    );
});

// --- inviteToProperty ---

describe("inviteToProperty", () => {
  it("returns USER_NOT_FOUND for an email with no account", async () => {
    mockAuth(ownerUserId);
    const result = await inviteToProperty(testPropertyId, {
      email: "nobody@test.invalid",
      role: "viewer",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
    expect(errorMessage(result.error)).toBe("USER_NOT_FOUND");
  });

  it("returns ALREADY_HAS_ACCESS when target already has an active access row", async () => {
    mockAuth(ownerUserId);
    const result = await inviteToProperty(testPropertyId, {
      email: "test-sharing-editor@test.invalid",
      role: "viewer",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
    expect(errorMessage(result.error)).toBe("ALREADY_HAS_ACCESS");
  });

  it("happy path — inserts access row with correct role, grantedBy, and recent grantedAt", async () => {
    mockAuth(ownerUserId);
    const before = new Date();
    const result = await inviteToProperty(testPropertyId, {
      email: "test-sharing-invitee@test.invalid",
      role: "viewer",
    });
    expect(result.ok).toBe(true);

    const [row] = await db
      .select()
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, testPropertyId),
          eq(propertyAccess.userId, inviteeUserId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .limit(1);

    expect(row).toBeDefined();
    expect(row!.propertyRole).toBe("viewer");
    expect(row!.grantedBy).toBe(ownerUserId);
    expect(row!.grantedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it("re-invite after removal — creates a fresh row (partial unique index allows it)", async () => {
    mockAuth(ownerUserId);

    // Invite first time
    await inviteToProperty(testPropertyId, {
      email: "test-sharing-invitee@test.invalid",
      role: "viewer",
    });

    // Simulate removal (soft-delete)
    await db
      .update(propertyAccess)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(propertyAccess.propertyId, testPropertyId),
          eq(propertyAccess.userId, inviteeUserId),
          isNull(propertyAccess.deletedAt),
        ),
      );

    // Re-invite should succeed — fresh INSERT, not a revival of the soft-deleted row
    const result = await inviteToProperty(testPropertyId, {
      email: "test-sharing-invitee@test.invalid",
      role: "editor",
    });
    expect(result.ok).toBe(true);

    const activeRows = await db
      .select()
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, testPropertyId),
          eq(propertyAccess.userId, inviteeUserId),
          isNull(propertyAccess.deletedAt),
        ),
      );
    expect(activeRows).toHaveLength(1);
    expect(activeRows[0]!.propertyRole).toBe("editor");
  });

  it("editor caller — gate returns NotFoundError", async () => {
    mockAuth(editorUserId);
    const result = await inviteToProperty(testPropertyId, {
      email: "test-sharing-invitee@test.invalid",
      role: "viewer",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("viewer caller — gate returns NotFoundError", async () => {
    mockAuth(viewerUserId);
    const result = await inviteToProperty(testPropertyId, {
      email: "test-sharing-invitee@test.invalid",
      role: "viewer",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });
});

// --- changePropertyRole ---

describe("changePropertyRole", () => {
  it("no-op when newRole equals the current role — returns ok without DB change", async () => {
    mockAuth(ownerUserId);
    const [before] = await db
      .select({ updatedAt: propertyAccess.updatedAt })
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, testPropertyId),
          eq(propertyAccess.userId, editorUserId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .limit(1);

    const result = await changePropertyRole(testPropertyId, {
      targetUserId: editorUserId,
      newRole: "editor",
    });
    expect(result.ok).toBe(true);

    const [after] = await db
      .select({ updatedAt: propertyAccess.updatedAt, role: propertyAccess.propertyRole })
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, testPropertyId),
          eq(propertyAccess.userId, editorUserId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .limit(1);
    expect(after!.role).toBe("editor");
    expect(after!.updatedAt.getTime()).toBe(before!.updatedAt.getTime());
  });

  it("OWNER_PROTECTED — cannot change another owner's role", async () => {
    mockAuth(ownerUserId);

    // Add a second owner
    await db.insert(propertyAccess).values({
      propertyId: testPropertyId,
      userId: secondOwnerUserId,
      propertyRole: "owner",
      grantedBy: ownerUserId,
    });

    const result = await changePropertyRole(testPropertyId, {
      targetUserId: secondOwnerUserId,
      newRole: "editor",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.FORBIDDEN);
    expect(errorMessage(result.error)).toBe("OWNER_PROTECTED");
  });

  it("LAST_OWNER — sole owner cannot downgrade themselves", async () => {
    mockAuth(ownerUserId);
    const result = await changePropertyRole(testPropertyId, {
      targetUserId: ownerUserId,
      newRole: "editor",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.FORBIDDEN);
    expect(errorMessage(result.error)).toBe("LAST_OWNER");
  });

  it("succeeds when a second owner is present — downgrade goes through", async () => {
    mockAuth(ownerUserId);

    await db.insert(propertyAccess).values({
      propertyId: testPropertyId,
      userId: secondOwnerUserId,
      propertyRole: "owner",
      grantedBy: ownerUserId,
    });

    const result = await changePropertyRole(testPropertyId, {
      targetUserId: ownerUserId,
      newRole: "editor",
    });
    expect(result.ok).toBe(true);

    const [row] = await db
      .select({ role: propertyAccess.propertyRole })
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, testPropertyId),
          eq(propertyAccess.userId, ownerUserId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .limit(1);
    expect(row!.role).toBe("editor");
  });

  it("grant metadata immutability — grantedBy and grantedAt unchanged after role change", async () => {
    mockAuth(ownerUserId);

    const [before] = await db
      .select({ grantedBy: propertyAccess.grantedBy, grantedAt: propertyAccess.grantedAt })
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, testPropertyId),
          eq(propertyAccess.userId, editorUserId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .limit(1);

    const result = await changePropertyRole(testPropertyId, {
      targetUserId: editorUserId,
      newRole: "viewer",
    });
    expect(result.ok).toBe(true);

    const [after] = await db
      .select({
        role: propertyAccess.propertyRole,
        grantedBy: propertyAccess.grantedBy,
        grantedAt: propertyAccess.grantedAt,
      })
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, testPropertyId),
          eq(propertyAccess.userId, editorUserId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .limit(1);

    expect(after!.role).toBe("viewer");
    expect(after!.grantedBy).toBe(before!.grantedBy);
    expect(after!.grantedAt.getTime()).toBe(before!.grantedAt.getTime());
  });

  it("editor caller — gate returns NotFoundError", async () => {
    mockAuth(editorUserId);
    const result = await changePropertyRole(testPropertyId, {
      targetUserId: viewerUserId,
      newRole: "editor",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("viewer caller — gate returns NotFoundError", async () => {
    mockAuth(viewerUserId);
    const result = await changePropertyRole(testPropertyId, {
      targetUserId: editorUserId,
      newRole: "viewer",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });
});

// --- removePropertyAccess ---

describe("removePropertyAccess", () => {
  it("SELF_REMOVAL_NOT_ALLOWED — owner cannot remove themselves via this action", async () => {
    mockAuth(ownerUserId);
    const result = await removePropertyAccess(testPropertyId, { targetUserId: ownerUserId });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.FORBIDDEN);
    expect(errorMessage(result.error)).toBe("SELF_REMOVAL_NOT_ALLOWED");
  });

  it("OWNER_PROTECTED — cannot remove another owner", async () => {
    mockAuth(ownerUserId);

    await db.insert(propertyAccess).values({
      propertyId: testPropertyId,
      userId: secondOwnerUserId,
      propertyRole: "owner",
      grantedBy: ownerUserId,
    });

    const result = await removePropertyAccess(testPropertyId, {
      targetUserId: secondOwnerUserId,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.FORBIDDEN);
    expect(errorMessage(result.error)).toBe("OWNER_PROTECTED");
  });

  it("happy path — soft-deletes the target's access row", async () => {
    mockAuth(ownerUserId);
    const result = await removePropertyAccess(testPropertyId, { targetUserId: viewerUserId });
    expect(result.ok).toBe(true);

    const [row] = await db
      .select({ deletedAt: propertyAccess.deletedAt })
      .from(propertyAccess)
      .where(
        and(eq(propertyAccess.propertyId, testPropertyId), eq(propertyAccess.userId, viewerUserId)),
      )
      .limit(1);

    expect(row!.deletedAt).not.toBeNull();
  });

  it("NotFoundError when target has no access row", async () => {
    mockAuth(ownerUserId);
    const result = await removePropertyAccess(testPropertyId, {
      targetUserId: inviteeUserId, // inviteeUserId has no access row in initial state
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("editor caller — gate returns NotFoundError", async () => {
    mockAuth(editorUserId);
    const result = await removePropertyAccess(testPropertyId, { targetUserId: viewerUserId });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("viewer caller — gate returns NotFoundError", async () => {
    mockAuth(viewerUserId);
    const result = await removePropertyAccess(testPropertyId, { targetUserId: editorUserId });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });
});

// --- leaveProperty ---

describe("leaveProperty", () => {
  it("viewer can leave — own access row is soft-deleted", async () => {
    mockAuth(viewerUserId);
    const result = await leaveProperty(testPropertyId);
    expect(result.ok).toBe(true);

    const [row] = await db
      .select({ deletedAt: propertyAccess.deletedAt })
      .from(propertyAccess)
      .where(
        and(eq(propertyAccess.propertyId, testPropertyId), eq(propertyAccess.userId, viewerUserId)),
      )
      .limit(1);
    expect(row!.deletedAt).not.toBeNull();
  });

  it("editor can leave — own access row is soft-deleted", async () => {
    mockAuth(editorUserId);
    const result = await leaveProperty(testPropertyId);
    expect(result.ok).toBe(true);

    const [row] = await db
      .select({ deletedAt: propertyAccess.deletedAt })
      .from(propertyAccess)
      .where(
        and(eq(propertyAccess.propertyId, testPropertyId), eq(propertyAccess.userId, editorUserId)),
      )
      .limit(1);
    expect(row!.deletedAt).not.toBeNull();
  });

  it("LAST_OWNER — sole owner cannot leave", async () => {
    mockAuth(ownerUserId);
    const result = await leaveProperty(testPropertyId);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.FORBIDDEN);
    expect(errorMessage(result.error)).toBe("LAST_OWNER");
  });

  it("owner can leave when a second owner is present — own row soft-deleted", async () => {
    mockAuth(ownerUserId);

    await db.insert(propertyAccess).values({
      propertyId: testPropertyId,
      userId: secondOwnerUserId,
      propertyRole: "owner",
      grantedBy: ownerUserId,
    });

    const result = await leaveProperty(testPropertyId);
    expect(result.ok).toBe(true);

    const [row] = await db
      .select({ deletedAt: propertyAccess.deletedAt })
      .from(propertyAccess)
      .where(
        and(eq(propertyAccess.propertyId, testPropertyId), eq(propertyAccess.userId, ownerUserId)),
      )
      .limit(1);
    expect(row!.deletedAt).not.toBeNull();
  });

  it("NotFoundError when user has no active access row", async () => {
    mockAuth(inviteeUserId);
    const result = await leaveProperty(testPropertyId);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });
});
