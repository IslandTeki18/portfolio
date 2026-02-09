import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

/**
 * Admin: Update or create resume (singleton)
 * Upserts the resume document with new fields
 */
export const updateResume = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const now = Date.now();

    // Check if resume already exists (singleton)
    const existing = await ctx.db.query("resume").first();

    if (existing) {
      // Update existing resume
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new resume
      const resumeId = await ctx.db.insert("resume", {
        ...args,
        updatedAt: now,
      });
      return resumeId;
    }
  },
});

/**
 * Admin: Get the resume (singleton)
 * Returns the first/only resume document or null
 */
export const getResume = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    return await ctx.db.query("resume").first();
  },
});

/**
 * Public: Get the resume (singleton)
 * Returns the first/only resume document or null
 */
export const getPublicResume = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("resume").first();
  },
});
