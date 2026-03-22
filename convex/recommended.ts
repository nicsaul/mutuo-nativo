import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./lib";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return ctx.db.query("recommended").collect();
  },
});

export const create = mutation({
  args: { title: v.string(), description: v.optional(v.string()), url: v.string(), category: v.string() },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);
    return ctx.db.insert("recommended", args);
  },
});

export const remove = mutation({
  args: { id: v.id("recommended") },
  handler: async (ctx, { id }) => {
    await requireRole(ctx, ["admin"]);
    await ctx.db.delete(id);
  },
});
