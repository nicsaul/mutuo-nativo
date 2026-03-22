import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./lib";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return ctx.db.query("tools").collect();
  },
});

export const create = mutation({
  args: { name: v.string(), description: v.optional(v.string()), category: v.string(), url: v.string() },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);
    return ctx.db.insert("tools", args);
  },
});

export const remove = mutation({
  args: { id: v.id("tools") },
  handler: async (ctx, { id }) => {
    await requireRole(ctx, ["admin"]);
    await ctx.db.delete(id);
  },
});
