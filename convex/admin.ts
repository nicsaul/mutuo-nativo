import { query } from "./_generated/server";
import { requireAdmin } from "./lib";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [profiles, posts, events, threads] = await Promise.all([
      ctx.db.query("profiles").collect(),
      ctx.db.query("posts").collect(),
      ctx.db.query("events").collect(),
      ctx.db.query("forumThreads").collect(),
    ]);
    return {
      totalMembers: profiles.length,
      totalPosts: posts.length,
      totalEvents: events.length,
      totalThreads: threads.length,
    };
  },
});

export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("profiles").take(500);
  },
});
