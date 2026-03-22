import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, sanitizeContent, getProfileByUserId } from "./lib";
import { forumCategory } from "./validators";

export const listThreads = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const threads = await ctx.db
      .query("forumThreads")
      .withIndex("by_activity")
      .order("desc")
      .take(50);

    return Promise.all(
      threads.map(async (t) => {
        const [profile, replies] = await Promise.all([
          getProfileByUserId(ctx, t.userId),
          ctx.db
          .query("forumReplies")
          .withIndex("by_thread", (q) => q.eq("threadId", t._id))
          .collect(),
        ]);
        return {
          ...t,
          author: profile?.name ?? "Usuario",
          authorInitials: profile?.initials ?? "?",
          replyCount: replies.length,
        };
      }),
    );
  },
});

export const getThread = query({
  args: { threadId: v.id("forumThreads") },
  handler: async (ctx, { threadId }) => {
    await requireAuth(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread) return null;
    const profile = await getProfileByUserId(ctx, thread.userId);
    return { ...thread, author: profile?.name ?? "Usuario", authorInitials: profile?.initials ?? "?" };
  },
});

export const getReplies = query({
  args: { threadId: v.id("forumThreads") },
  handler: async (ctx, { threadId }) => {
    await requireAuth(ctx);
    const replies = await ctx.db
      .query("forumReplies")
      .withIndex("by_thread", (q) => q.eq("threadId", threadId))
      .collect();
    return Promise.all(
      replies.map(async (r) => {
        const profile = await getProfileByUserId(ctx, r.userId);
        return { ...r, author: profile?.name ?? "Usuario", authorInitials: profile?.initials ?? "?" };
      }),
    );
  },
});

export const createThread = mutation({
  args: { title: v.string(), body: v.string(), category: forumCategory },
  handler: async (ctx, { title, body, category }) => {
    const userId = await requireAuth(ctx);
    const now = new Date().toISOString();
    return ctx.db.insert("forumThreads", {
      userId,
      title: sanitizeContent(title),
      body: sanitizeContent(body),
      category,
      createdAt: now,
      lastActivityAt: now,
    });
  },
});

export const addReply = mutation({
  args: { threadId: v.id("forumThreads"), content: v.string() },
  handler: async (ctx, { threadId, content }) => {
    const userId = await requireAuth(ctx);
    const clean = sanitizeContent(content);
    if (!clean) throw new Error("La respuesta no puede estar vacia");
    const now = new Date().toISOString();
    await ctx.db.patch(threadId, { lastActivityAt: now });
    return ctx.db.insert("forumReplies", {
      threadId,
      userId,
      content: clean,
      createdAt: now,
    });
  },
});
