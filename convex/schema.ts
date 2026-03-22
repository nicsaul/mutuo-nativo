import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  userRole,
  eventStatus,
  missionStatus,
  blogStatus,
  capsuleStatus,
  notificationType,
  forumCategory,
} from "./validators";

export default defineSchema({
  ...authTables,

  profiles: defineTable({
    userId: v.string(),
    name: v.string(),
    initials: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    company: v.optional(v.string()),
    position: v.optional(v.string()),
    role: userRole,
    joinYear: v.optional(v.number()),
    linkedin: v.optional(v.string()),
    website: v.optional(v.string()),
    looking: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    lastSeen: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  posts: defineTable({
    userId: v.string(),
    content: v.string(),
    createdAt: v.string(),
  }).index("by_created", ["createdAt"]),

  postLikes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_user_post", ["userId", "postId"]),

  postComments: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    content: v.string(),
    createdAt: v.string(),
  }).index("by_post", ["postId"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    eventDate: v.string(),
    time: v.optional(v.string()),
    status: eventStatus,
    zoomLink: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    createdBy: v.string(),
  })
    .index("by_date", ["eventDate"])
    .index("by_status", ["status"]),

  missions: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    week: v.string(),
    sortOrder: v.number(),
    difficulty: v.optional(v.string()),
    estimatedTime: v.optional(v.string()),
    coverStorageId: v.optional(v.id("_storage")),
    objective: v.optional(v.string()),
    content: v.optional(v.string()),
    resources: v.optional(v.array(v.string())),
    deliveryCriteria: v.optional(v.string()),
  }).index("by_sort", ["sortOrder"]),

  userMissions: defineTable({
    userId: v.string(),
    missionId: v.id("missions"),
    status: missionStatus,
    completedAt: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_mission", ["missionId"])
    .index("by_user_mission", ["userId", "missionId"]),

  forumThreads: defineTable({
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    category: forumCategory,
    pinned: v.optional(v.boolean()),
    createdAt: v.string(),
    lastActivityAt: v.string(),
  })
    .index("by_activity", ["lastActivityAt"])
    .index("by_category", ["category"]),

  forumReplies: defineTable({
    threadId: v.id("forumThreads"),
    userId: v.string(),
    content: v.string(),
    createdAt: v.string(),
  }).index("by_thread", ["threadId"]),

  blogPosts: defineTable({
    title: v.string(),
    excerpt: v.optional(v.string()),
    body: v.optional(v.string()),
    category: v.optional(v.string()),
    readTime: v.optional(v.string()),
    publishedAt: v.optional(v.string()),
    author: v.optional(v.string()),
    status: blogStatus,
    coverStorageId: v.optional(v.id("_storage")),
    slug: v.string(),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_published", ["publishedAt"])
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  capsules: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    duration: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    status: capsuleStatus,
    year: v.number(),
    sortOrder: v.number(),
  })
    .index("by_sort", ["sortOrder"])
    .index("by_year", ["year"]),

  recommended: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
    category: v.string(),
  }).index("by_category", ["category"]),

  tools: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    url: v.string(),
  }).index("by_category", ["category"]),

  notifications: defineTable({
    userId: v.string(),
    type: notificationType,
    text: v.string(),
    read: v.boolean(),
    relatedId: v.optional(v.string()),
    relatedType: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "read"]),
});
