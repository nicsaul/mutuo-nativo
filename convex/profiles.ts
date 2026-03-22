import { query, mutation } from "./_generated/server";
import { type Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { requireAuth, requireAdmin, getProfileByUserId } from "./lib";
import { userRole } from "./validators";

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return getProfileByUserId(ctx, userId);
  },
});

export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    await requireAuth(ctx);
    return getProfileByUserId(ctx, userId);
  },
});

export const getProfileById = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, { profileId }) => {
    await requireAuth(ctx);
    return ctx.db.get(profileId);
  },
});

export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const existing = await getProfileByUserId(ctx, userId);
    if (existing) return existing._id;

    // Pull name and email from the auth user record
    const authUser = await ctx.db.get(userId as Id<"users">);
    const name = authUser?.name ?? "Member";
    const email = authUser?.email ?? "";

    const initials = name
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return ctx.db.insert("profiles", {
      userId,
      name,
      initials,
      email,
      role: "member",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    company: v.optional(v.string()),
    position: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    website: v.optional(v.string()),
    looking: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const profile = await getProfileByUserId(ctx, userId);
    if (!profile) throw new Error("Profile not found");

    const patch: Record<string, unknown> = {};
    if (args.name !== undefined) {
      patch.name = args.name;
      patch.initials = args.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (args.bio !== undefined) patch.bio = args.bio;
    if (args.skills !== undefined) patch.skills = args.skills;
    if (args.company !== undefined) patch.company = args.company;
    if (args.position !== undefined) patch.position = args.position;
    if (args.linkedin !== undefined) patch.linkedin = args.linkedin;
    if (args.website !== undefined) patch.website = args.website;
    if (args.looking !== undefined) patch.looking = args.looking;

    await ctx.db.patch(profile._id, patch);
  },
});

/** Bootstrap the first admin. Only works when no admin exists yet. */
export const bootstrapAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const existingAdmin = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();
    if (existingAdmin) {
      throw new Error("An admin already exists. Use updateUserRole instead.");
    }
    const profile = await getProfileByUserId(ctx, userId);
    if (!profile) throw new Error("Create your profile first");
    await ctx.db.patch(profile._id, { role: "admin" });
  },
});

export const updateUserRole = mutation({
  args: {
    profileId: v.id("profiles"),
    role: userRole,
  },
  handler: async (ctx, { profileId, role }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(profileId, { role });
  },
});
