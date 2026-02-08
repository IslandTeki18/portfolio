import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authProviderId: v.string(),
    role: v.literal("admin"),
    createdAt: v.number(),
  }).index("by_authProviderId", ["authProviderId"]),

  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    longDescription: v.optional(v.string()),
    coverImageId: v.optional(v.id("_storage")),
    galleryImageIds: v.optional(v.array(v.id("_storage"))),
    techStack: v.optional(v.array(v.string())),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    status: v.union(v.literal("draft"), v.literal("published")),
    sortOrder: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    deletedAt: v.optional(v.union(v.number(), v.null())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status_deletedAt", ["status", "deletedAt"])
    .index("by_deletedAt", ["deletedAt"]),

  businesses: defineTable({
    name: v.string(),
    slug: v.string(),
    logoImageId: v.optional(v.id("_storage")),
    shortDescription: v.string(),
    longDescription: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    active: v.boolean(),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    deletedAt: v.optional(v.union(v.number(), v.null())),
  })
    .index("by_slug", ["slug"])
    .index("by_active_deletedAt", ["active", "deletedAt"]),

  resume: defineTable({
    headline: v.optional(v.string()),
    summary: v.optional(v.string()),
    experience: v.optional(
      v.array(
        v.object({
          company: v.string(),
          role: v.string(),
          start: v.optional(v.string()),
          end: v.optional(v.string()),
          bullets: v.optional(v.array(v.string())),
        }),
      ),
    ),
    skills: v.optional(v.array(v.string())),
    education: v.optional(
      v.array(
        v.object({
          school: v.string(),
          degree: v.optional(v.string()),
          year: v.optional(v.string()),
        }),
      ),
    ),
    pdfStorageId: v.optional(v.id("_storage")),
    updatedAt: v.number(),
  }),
});
