import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./lib";
import { eventStatus } from "./validators";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return ctx.db.query("events").withIndex("by_date").order("asc").collect();
  },
});

export const get = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    await requireAuth(ctx);
    return ctx.db.get(eventId);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    eventDate: v.string(),
    time: v.optional(v.string()),
    status: eventStatus,
    zoomLink: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireRole(ctx, ["admin", "team"]);
    return ctx.db.insert("events", { ...args, createdBy: userId });
  },
});

export const update = mutation({
  args: {
    eventId: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    eventDate: v.optional(v.string()),
    time: v.optional(v.string()),
    status: v.optional(eventStatus),
    zoomLink: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
  },
  handler: async (ctx, { eventId, ...args }) => {
    await requireRole(ctx, ["admin", "team"]);
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(args)) {
      if (val !== undefined) patch[k] = val;
    }
    await ctx.db.patch(eventId, patch);
  },
});

export const remove = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    await requireRole(ctx, ["admin"]);
    await ctx.db.delete(eventId);
  },
});
