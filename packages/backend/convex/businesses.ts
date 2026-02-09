import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";
import {
  validateBusinessRequired,
  validateSlugFormat,
} from "./validators";

/**
 * Admin: Create a new business
 * Validates required fields, slug format, and slug uniqueness
 */
export const createBusiness = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    logoImageId: v.optional(v.id("_storage")),
    longDescription: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Validate required fields
    validateBusinessRequired({
      name: args.name,
      slug: args.slug,
      shortDescription: args.shortDescription,
    });

    // Validate slug format
    validateSlugFormat(args.slug);

    // Check slug uniqueness
    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error(`Business with slug '${args.slug}' already exists.`);
    }

    // Insert business with defaults
    const businessId = await ctx.db.insert("businesses", {
      name: args.name,
      slug: args.slug,
      shortDescription: args.shortDescription,
      logoImageId: args.logoImageId,
      longDescription: args.longDescription,
      websiteUrl: args.websiteUrl,
      active: args.active ?? true,
      featured: args.featured,
      sortOrder: args.sortOrder,
      tags: args.tags,
      deletedAt: null,
    });

    return businessId;
  },
});

/**
 * Admin: Update an existing business
 * Validates slug format and uniqueness if slug changed
 */
export const updateBusiness = mutation({
  args: {
    id: v.id("businesses"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    logoImageId: v.optional(v.id("_storage")),
    longDescription: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
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
        .query("businesses")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .first();

      if (existing && existing._id !== id) {
        throw new Error(`Business with slug '${newSlug}' already exists.`);
      }
    }

    // Update business
    await ctx.db.patch(id, updates);

    return id;
  },
});

/**
 * Admin: Soft-delete a business by setting deletedAt
 */
export const softDeleteBusiness = mutation({
  args: {
    id: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Admin: List all businesses (including inactive and deleted)
 * Sorted by sortOrder asc (nulls last)
 */
export const listAllBusinesses = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const businesses = await ctx.db.query("businesses").collect();

    // Sort by sortOrder ascending (nulls last)
    return businesses.sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      if (a.sortOrder !== undefined) return -1;
      if (b.sortOrder !== undefined) return 1;
      return 0;
    });
  },
});

/**
 * Admin: Get a single business by ID
 */
export const getBusinessById = query({
  args: {
    id: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.get(args.id);
  },
});

/**
 * Public: List all active businesses
 * Excludes inactive and deleted businesses
 * Sorted by sortOrder asc (nulls last)
 */
export const listPublishedBusinesses = query({
  args: {},
  handler: async (ctx) => {
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_active_deletedAt", (q) =>
        q.eq("active", true).eq("deletedAt", null)
      )
      .collect();

    // Sort by sortOrder ascending (nulls last)
    return businesses.sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      if (a.sortOrder !== undefined) return -1;
      if (b.sortOrder !== undefined) return 1;
      return 0;
    });
  },
});
