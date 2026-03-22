import { v } from "convex/values";

export const userRole = v.union(
  v.literal("admin"),
  v.literal("team"),
  v.literal("mentor"),
  v.literal("member"),
);

export const eventStatus = v.union(
  v.literal("upcoming"),
  v.literal("recorded"),
  v.literal("cancelled"),
);

export const missionStatus = v.union(
  v.literal("locked"),
  v.literal("active"),
  v.literal("completed"),
);

export const blogStatus = v.union(
  v.literal("draft"),
  v.literal("published"),
);

export const capsuleStatus = v.union(
  v.literal("available"),
  v.literal("locked"),
);

export const notificationType = v.union(
  v.literal("like"),
  v.literal("comment"),
  v.literal("reply"),
  v.literal("mission_update"),
  v.literal("event_reminder"),
  v.literal("welcome"),
  v.literal("system"),
);

export const forumCategory = v.union(
  v.literal("question"),
  v.literal("resources"),
  v.literal("discussion"),
  v.literal("experience"),
);
