import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";
import {
  validateProjectRequired,
  validateSlugFormat,
} from "./validators";

/**
 * Admin: Create a new project
 * Validates required fields, slug format, and slug uniqueness
 */
export const createProject = mutation({
  args: {
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
    sortOrder: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Validate required fields
    validateProjectRequired({
      title: args.title,
      slug: args.slug,
      shortDescription: args.shortDescription,
    });

    // Validate slug format
    validateSlugFormat(args.slug);

    // Check slug uniqueness
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error(`Project with slug '${args.slug}' already exists.`);
    }

    // Insert project with defaults
    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      title: args.title,
      slug: args.slug,
      shortDescription: args.shortDescription,
      longDescription: args.longDescription,
      coverImageId: args.coverImageId,
      galleryImageIds: args.galleryImageIds,
      techStack: args.techStack,
      liveUrl: args.liveUrl,
      repoUrl: args.repoUrl,
      featured: args.featured,
      status: "draft",
      sortOrder: args.sortOrder,
      tags: args.tags,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

/**
 * Admin: Update an existing project
 * Validates slug format and uniqueness if slug changed
 */
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    coverImageId: v.optional(v.id("_storage")),
    galleryImageIds: v.optional(v.array(v.id("_storage"))),
    techStack: v.optional(v.array(v.string())),
    liveUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { id, ...updates } = args;

    // If slug is being updated, validate format and uniqueness
    if (updates.slug !== undefined) {
      const newSlug = updates.slug;
      validateSlugFormat(newSlug);

      const existing = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .first();

      if (existing && existing._id !== id) {
        throw new Error(`Project with slug '${newSlug}' already exists.`);
      }
    }

    // Update with new timestamp
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * Admin: Soft-delete a project by setting deletedAt
 */
export const softDeleteProject = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const now = Date.now();
    await ctx.db.patch(args.id, {
      deletedAt: now,
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Admin: Publish a project (set status to published)
 */
export const publishProject = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await ctx.db.patch(args.id, {
      status: "published",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Admin: Unpublish a project (set status to draft)
 */
export const unpublishProject = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await ctx.db.patch(args.id, {
      status: "draft",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Admin: List all projects (including drafts and deleted)
 * Sorted by sortOrder asc (nulls last), then createdAt desc
 */
export const listAllProjects = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const projects = await ctx.db.query("projects").collect();

    // Sort by sortOrder ascending (nulls last), then createdAt descending
    return projects.sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      if (a.sortOrder !== undefined) return -1;
      if (b.sortOrder !== undefined) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

/**
 * Admin: Get a single project by ID
 */
export const getProjectById = query({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.get(args.id);
  },
});

/**
 * Public: List all published projects
 * Excludes drafts and deleted projects
 * Sorted by sortOrder asc (nulls last), then createdAt desc
 */
export const listPublishedProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_status_deletedAt", (q) =>
        q.eq("status", "published").eq("deletedAt", null)
      )
      .collect();

    // Sort by sortOrder ascending (nulls last), then createdAt descending
    return projects.sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      if (a.sortOrder !== undefined) return -1;
      if (b.sortOrder !== undefined) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

/**
 * Public: Get a single published project by slug
 * Returns null if project is missing, draft, or deleted
 */
export const getPublishedProjectBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    // Return null if missing, draft, or deleted
    if (!project || project.status !== "published" || project.deletedAt !== null) {
      return null;
    }

    return project;
  },
});
