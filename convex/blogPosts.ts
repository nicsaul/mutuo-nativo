import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole, sanitizeContent } from "./lib";
import { blogStatus } from "./validators";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    await requireAuth(ctx);
    return ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    title: v.string(), excerpt: v.optional(v.string()), body: v.optional(v.string()),
    category: v.optional(v.string()), readTime: v.optional(v.string()),
    author: v.optional(v.string()), status: blogStatus, slug: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "team"]);
    return ctx.db.insert("blogPosts", {
      ...args,
      publishedAt: args.status === "published" ? new Date().toISOString() : undefined,
    });
  },
});

export const update = mutation({
  args: {
    postId: v.id("blogPosts"), title: v.optional(v.string()), excerpt: v.optional(v.string()),
    body: v.optional(v.string()), category: v.optional(v.string()),
    readTime: v.optional(v.string()), status: v.optional(blogStatus),
    slug: v.optional(v.string()), tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { postId, ...args }) => {
    await requireRole(ctx, ["admin", "team"]);
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(args)) {
      if (val !== undefined) patch[k] = val;
    }
    if (args.status === "published") patch.publishedAt = new Date().toISOString();
    await ctx.db.patch(postId, patch);
  },
});

export const remove = mutation({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, { postId }) => {
    await requireRole(ctx, ["admin"]);
    await ctx.db.delete(postId);
  },
});
