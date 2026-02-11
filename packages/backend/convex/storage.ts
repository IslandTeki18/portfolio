import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

/**
 * Admin: Generate a short-lived upload URL for Convex file storage
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Admin: Delete a file from storage
 */
export const deleteFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.storage.delete(args.storageId);
  },
});

/**
 * Public: Get a URL for a single storage ID
 */
export const getFileUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/**
 * Public: Batch resolve storage IDs to URLs
 */
export const getFileUrls = query({
  args: {
    storageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const urls = await Promise.all(
      args.storageIds.map(async (id) => ({
        storageId: id,
        url: await ctx.storage.getUrl(id),
      })),
    );
    return urls;
  },
});

/**
 * Admin: Remove the cover image from a project
 * Deletes the file from storage and clears the field
 */
export const removeProjectCoverImage = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found");

    if (project.coverImageId) {
      await ctx.storage.delete(project.coverImageId);
    }

    await ctx.db.patch(args.id, {
      coverImageId: undefined,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Admin: Add an image to a project's gallery
 */
export const addProjectGalleryImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const current = project.galleryImageIds ?? [];
    await ctx.db.patch(args.projectId, {
      galleryImageIds: [...current, args.storageId],
      updatedAt: Date.now(),
    });
  },
});

/**
 * Admin: Remove an image from a project's gallery
 * Deletes the file from storage and removes from array
 */
export const removeProjectGalleryImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    await ctx.storage.delete(args.storageId);

    const current = project.galleryImageIds ?? [];
    await ctx.db.patch(args.projectId, {
      galleryImageIds: current.filter((id) => id !== args.storageId),
      updatedAt: Date.now(),
    });
  },
});

/**
 * Admin: Reorder gallery images by replacing with a new ordered array
 */
export const reorderProjectGalleryImages = mutation({
  args: {
    projectId: v.id("projects"),
    orderedIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    await ctx.db.patch(args.projectId, {
      galleryImageIds: args.orderedIds,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Admin: Remove the logo from a business
 * Deletes the file from storage and clears the field
 */
export const removeBusinessLogo = mutation({
  args: {
    id: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const business = await ctx.db.get(args.id);
    if (!business) throw new Error("Business not found");

    if (business.logoImageId) {
      await ctx.storage.delete(business.logoImageId);
    }

    await ctx.db.patch(args.id, {
      logoImageId: undefined,
    });
  },
});

/**
 * Admin: Remove the PDF from the resume singleton
 * Deletes the file from storage and clears the field
 */
export const removeResumePdf = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const resume = await ctx.db.query("resume").first();
    if (!resume) throw new Error("Resume not found");

    if (resume.pdfStorageId) {
      await ctx.storage.delete(resume.pdfStorageId);
    }

    await ctx.db.patch(resume._id, {
      pdfStorageId: undefined,
      updatedAt: Date.now(),
    });
  },
});
