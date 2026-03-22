import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, sanitizeContent, getProfileByUserId } from "./lib";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const posts = await ctx.db.query("posts").order("desc").take(50);

    return Promise.all(
      posts.map(async (post) => {
        const [profile, likes, comments] = await Promise.all([
          getProfileByUserId(ctx, post.userId),
          ctx.db
            .query("postLikes")
            .withIndex("by_post", (q) => q.eq("postId", post._id))
            .collect(),
          ctx.db
            .query("postComments")
            .withIndex("by_post", (q) => q.eq("postId", post._id))
            .collect(),
        ]);

        const userLiked = likes.some((l) => l.userId === userId);

        return {
          ...post,
          author: profile?.name ?? "Usuario",
          authorInitials: profile?.initials ?? "?",
          authorRole: profile?.role ?? "member",
          likeCount: likes.length,
          commentCount: comments.length,
          userLiked,
        };
      }),
    );
  },
});

export const create = mutation({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const userId = await requireAuth(ctx);
    const clean = sanitizeContent(content);
    if (!clean) throw new Error("El contenido no puede estar vacio");
    return ctx.db.insert("posts", {
      userId,
      content: clean,
      createdAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const userId = await requireAuth(ctx);
    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post no encontrado");
    const profile = await getProfileByUserId(ctx, userId);
    if (post.userId !== userId && profile?.role !== "admin") {
      throw new Error("No tenes permiso para eliminar este post");
    }
    // Delete likes and comments
    const likes = await ctx.db
      .query("postLikes")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    for (const like of likes) await ctx.db.delete(like._id);
    const comments = await ctx.db
      .query("postComments")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    for (const comment of comments) await ctx.db.delete(comment._id);
    await ctx.db.delete(postId);
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const userId = await requireAuth(ctx);
    const existing = await ctx.db
      .query("postLikes")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", userId).eq("postId", postId),
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }
    await ctx.db.insert("postLikes", { postId, userId });
    return true;
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    await requireAuth(ctx);
    const comments = await ctx.db
      .query("postComments")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    return Promise.all(
      comments.map(async (c) => {
        const profile = await getProfileByUserId(ctx, c.userId);
        return {
          ...c,
          author: profile?.name ?? "Usuario",
          authorInitials: profile?.initials ?? "?",
        };
      }),
    );
  },
});

export const addComment = mutation({
  args: { postId: v.id("posts"), content: v.string() },
  handler: async (ctx, { postId, content }) => {
    const userId = await requireAuth(ctx);
    const clean = sanitizeContent(content);
    if (!clean) throw new Error("El comentario no puede estar vacio");
    return ctx.db.insert("postComments", {
      postId,
      userId,
      content: clean,
      createdAt: new Date().toISOString(),
    });
  },
});
