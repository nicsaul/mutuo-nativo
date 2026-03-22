import { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

type UserRole = "admin" | "team" | "mentor" | "member";

export async function requireAuth(
  ctx: QueryCtx | MutationCtx,
): Promise<string> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
): Promise<string> {
  const userId = await requireAuth(ctx);
  const profile = await getProfileByUserId(ctx, userId);
  if (!profile || profile.role !== "admin") {
    throw new Error("Admin access required");
  }
  return userId;
}

export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  allowedRoles: UserRole[],
): Promise<string> {
  const userId = await requireAuth(ctx);
  const profile = await getProfileByUserId(ctx, userId);
  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new Error("Insufficient permissions");
  }
  return userId;
}

export async function getProfileByUserId(
  ctx: QueryCtx | MutationCtx,
  userId: string,
) {
  return ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

export function sanitizeContent(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

export function truncateError(err: unknown, maxLen = 500): string {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.length > maxLen ? msg.slice(0, maxLen) + "…" : msg;
}
