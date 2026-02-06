import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authProviderId: v.string(),
    role: v.literal("admin"),
    createdAt: v.number(),
  }),

  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(),
    technologies: v.array(v.string()),
    thumbnailUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    deletedAt: v.union(v.number(), v.null()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status_deletedAt", ["status", "deletedAt"]),

  businesses: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    role: v.string(),
    url: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    deletedAt: v.union(v.number(), v.null()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  resume: defineTable({
    key: v.literal("singleton"),
    sections: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        content: v.string(),
        sortOrder: v.number(),
      }),
    ),
    pdfStorageId: v.optional(v.id("_storage")),
    updatedAt: v.number(),
  }),
});
