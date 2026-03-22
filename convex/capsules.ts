import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./lib";
import { capsuleStatus } from "./validators";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return ctx.db.query("capsules").withIndex("by_sort").order("asc").collect();
  },
});

export const get = query({
  args: { capsuleId: v.id("capsules") },
  handler: async (ctx, { capsuleId }) => {
    await requireAuth(ctx);
    return ctx.db.get(capsuleId);
  },
});

export const create = mutation({
  args: {
    title: v.string(), description: v.optional(v.string()), duration: v.optional(v.string()),
    audioUrl: v.optional(v.string()), status: capsuleStatus, year: v.number(), sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "team"]);
    return ctx.db.insert("capsules", args);
  },
});

export const remove = mutation({
  args: { capsuleId: v.id("capsules") },
  handler: async (ctx, { capsuleId }) => {
    await requireRole(ctx, ["admin"]);
    await ctx.db.delete(capsuleId);
  },
});
