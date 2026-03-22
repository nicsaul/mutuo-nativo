import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./lib";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return ctx.db.query("profiles").take(500);
  },
});

export const getById = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, { profileId }) => {
    await requireAuth(ctx);
    return ctx.db.get(profileId);
  },
});
