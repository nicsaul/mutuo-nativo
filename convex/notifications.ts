import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./lib";
import { notificationType } from "./validators";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(30);
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    // Take up to 100 — enough for a badge count without unbounded collect
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("read", false))
      .take(100);
    return unread.length;
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, { notificationId }) => {
    await requireAuth(ctx);
    await ctx.db.patch(notificationId, { read: true });
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("read", false))
      .collect();
    for (const n of unread) {
      await ctx.db.patch(n._id, { read: true });
    }
  },
});

export const createNotification = internalMutation({
  args: {
    userId: v.string(),
    type: notificationType,
    text: v.string(),
    relatedId: v.optional(v.string()),
    relatedType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("notifications", {
      ...args,
      read: false,
      createdAt: new Date().toISOString(),
    });
  },
});
