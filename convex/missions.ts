import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./lib";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const missions = await ctx.db
      .query("missions")
      .withIndex("by_sort")
      .order("asc")
      .collect();

    const userMissions = await ctx.db
      .query("userMissions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const progressMap = new Map(
      userMissions.map((um) => [um.missionId.toString(), um.status]),
    );

    return missions.map((m) => ({
      ...m,
      userStatus: progressMap.get(m._id.toString()) ?? "locked",
    }));
  },
});

export const get = query({
  args: { missionId: v.id("missions") },
  handler: async (ctx, { missionId }) => {
    await requireAuth(ctx);
    return ctx.db.get(missionId);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    week: v.string(),
    sortOrder: v.number(),
    difficulty: v.optional(v.string()),
    estimatedTime: v.optional(v.string()),
    objective: v.optional(v.string()),
    content: v.optional(v.string()),
    deliveryCriteria: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);
    return ctx.db.insert("missions", args);
  },
});

export const updateProgress = mutation({
  args: {
    missionId: v.id("missions"),
    status: v.union(
      v.literal("locked"),
      v.literal("active"),
      v.literal("completed"),
    ),
  },
  handler: async (ctx, { missionId, status }) => {
    const userId = await requireAuth(ctx);
    const existing = await ctx.db
      .query("userMissions")
      .withIndex("by_user_mission", (q) =>
        q.eq("userId", userId).eq("missionId", missionId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status,
        ...(status === "completed"
          ? { completedAt: new Date().toISOString() }
          : {}),
      });
    } else {
      await ctx.db.insert("userMissions", {
        userId,
        missionId,
        status,
        ...(status === "completed"
          ? { completedAt: new Date().toISOString() }
          : {}),
      });
    }
  },
});
