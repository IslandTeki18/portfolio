import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@repo/lib/convex";
import { useUpload } from "@repo/lib/use-upload";
import { useStorageUrl, useStorageUrls } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { FileUpload, ImagePreview } from "@repo/ui/file-upload";
import {
  BackLink,
  CheckboxField,
  PageHeader,
  Section,
} from "../components/AdminLayout";

interface ProjectFormData {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  techStack?: string;
  liveUrl?: string;
  repoUrl?: string;
  tags?: string;
  sortOrder?: number;
  featured?: boolean;
}

export default function ProjectCreate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const createProject = useMutation(api.projects.createProject);
  const { upload, isUploading, error: uploadError } = useUpload(
    api.storage.generateUploadUrl,
  );

  const [coverImageId, setCoverImageId] = useState<Id<"_storage"> | undefined>();
  const coverUrl = useStorageUrl(api.storage.getFileUrl, coverImageId);

  const [galleryImageIds, setGalleryImageIds] = useState<Id<"_storage">[]>([]);
  const galleryUrls = useStorageUrls(
    api.storage.getFileUrls,
    galleryImageIds.length > 0 ? (galleryImageIds as string[]) : undefined,
  );
  const {
    upload: galleryUpload,
    isUploading: isGalleryUploading,
    error: galleryUploadError,
  } = useUpload(api.storage.generateUploadUrl);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>();

  const handleCoverUpload = async (file: File) => {
    try {
      const storageId = await upload(file);
      setCoverImageId(storageId as Id<"_storage">);
    } catch {
      addToast({ type: "error", message: "Failed to upload cover image" });
    }
  };

  const handleGalleryUpload = async (file: File) => {
    try {
      const storageId = await galleryUpload(file);
      setGalleryImageIds((prev) => [...prev, storageId as Id<"_storage">]);
    } catch {
      addToast({ type: "error", message: "Failed to upload gallery image" });
    }
  };

  const handleRemoveGalleryImage = (storageId: Id<"_storage">) => {
    setGalleryImageIds((prev) => prev.filter((id) => id !== storageId));
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject({
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription || undefined,
        coverImageId: coverImageId,
        galleryImageIds: galleryImageIds.length > 0 ? galleryImageIds : undefined,
        techStack: data.techStack
          ? data.techStack.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        liveUrl: data.liveUrl || undefined,
        repoUrl: data.repoUrl || undefined,
        tags: data.tags
          ? data.tags.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        sortOrder: data.sortOrder,
        featured: data.featured,
      });
      addToast({
        type: "success",
        message: "Project created successfully",
      });
      navigate("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to create project",
      });
    }
  };

  return (
    <>
      <BackLink to="/projects">Projects</BackLink>
      <PageHeader title="New project" />

      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <Section label="Basics">
          <Input
            {...register("title", { required: "Title is required" })}
            label="Title"
            placeholder="Project title"
            required
            fullWidth
            error={errors.title?.message}
          />
          <Input
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Slug must be lowercase with hyphens only",
              },
            })}
            label="Slug"
            placeholder="project-slug"
            required
            fullWidth
            className="font-mono text-sm"
            error={errors.slug?.message}
            helperText="Lowercase letters, numbers, and hyphens"
          />
          <Textarea
            {...register("shortDescription", {
              required: "Short description is required",
            })}
            label="Short description"
            placeholder="Brief summary..."
            rows={2}
            required
            fullWidth
            error={errors.shortDescription?.message}
          />
          <Textarea
            {...register("longDescription")}
            label="Long description"
            placeholder="Detailed description..."
            rows={6}
            fullWidth
          />
        </Section>

        <Section label="Images">
          {coverImageId && coverUrl ? (
            <div>
              <span className="mb-1.5 block text-[13px] font-medium text-muted-foreground">
                Cover
              </span>
              <ImagePreview
                url={coverUrl}
                alt="Cover image"
                size="lg"
                onRemove={() => setCoverImageId(undefined)}
              />
            </div>
          ) : (
            <FileUpload
              label="Cover"
              accept="image/*"
              isUploading={isUploading}
              error={uploadError ?? undefined}
              onFileSelect={handleCoverUpload}
              helperText="Recommended: 1200x630px"
              fullWidth
            />
          )}

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-muted-foreground">
              Gallery
            </span>
            {galleryUrls && galleryUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5">
                {galleryUrls.map((item, index) =>
                  item.url ? (
                    <ImagePreview
                      key={item.storageId}
                      url={item.url}
                      alt={`Gallery image ${index + 1}`}
                      size="lg"
                      onRemove={() =>
                        handleRemoveGalleryImage(item.storageId as Id<"_storage">)
                      }
                      className="w-full"
                    />
                  ) : null,
                )}
              </div>
            )}
            <FileUpload
              accept="image/*"
              isUploading={isGalleryUploading}
              error={galleryUploadError ?? undefined}
              onFileSelect={handleGalleryUpload}
              helperText="JPG, PNG or WebP"
              fullWidth
              size="sm"
            />
          </div>
        </Section>

        <Section label="Details">
          <Input
            {...register("techStack")}
            label="Tech stack"
            placeholder="React, TypeScript, Tailwind"
            fullWidth
            helperText="Comma-separated"
          />
          <Input
            {...register("tags")}
            label="Tags"
            placeholder="frontend, fullstack"
            fullWidth
            helperText="Comma-separated"
          />
          <div className="grid grid-cols-2 gap-3.5">
            <Input
              {...register("liveUrl")}
              label="Live URL"
              type="url"
              placeholder="https://..."
              fullWidth
            />
            <Input
              {...register("repoUrl")}
              label="Repo URL"
              type="url"
              placeholder="https://github.com/..."
              fullWidth
            />
          </div>
          <div className="grid grid-cols-2 items-end gap-3.5">
            <Input
              {...register("sortOrder", { valueAsNumber: true })}
              label="Sort order"
              type="number"
              placeholder="0"
              fullWidth
            />
            <CheckboxField
              label="Featured on the home page"
              {...register("featured")}
            />
          </div>
        </Section>

        <div className="flex gap-2.5 border-t border-border pt-6">
          <Button
            type="submit"
            size="sm"
            className="rounded-md"
            disabled={isSubmitting || isUploading || isGalleryUploading}
          >
            {isSubmitting ? "Saving..." : "Save as draft"}
          </Button>
          <Link to="/projects">
            <Button variant="outline" size="sm" type="button" className="rounded-md border">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </>
  );
}
