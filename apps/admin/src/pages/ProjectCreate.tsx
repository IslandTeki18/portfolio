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
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { FileUpload, ImagePreview } from "@repo/ui/file-upload";

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
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/projects">
          <Button variant="ghost">&larr; Back to Projects</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                error={errors.slug?.message}
                helperText="Lowercase letters, numbers, and hyphens only"
              />
              <Textarea
                {...register("shortDescription", {
                  required: "Short description is required",
                })}
                label="Short Description"
                placeholder="Brief summary..."
                rows={2}
                required
                fullWidth
                error={errors.shortDescription?.message}
              />
              <Textarea
                {...register("longDescription")}
                label="Long Description"
                placeholder="Detailed description..."
                rows={6}
                fullWidth
              />

              <div>
                {coverImageId && coverUrl ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Cover Image
                    </label>
                    <ImagePreview
                      url={coverUrl}
                      alt="Cover image"
                      size="lg"
                      onRemove={() => setCoverImageId(undefined)}
                    />
                  </div>
                ) : (
                  <FileUpload
                    label="Cover Image"
                    accept="image/*"
                    isUploading={isUploading}
                    error={uploadError ?? undefined}
                    onFileSelect={handleCoverUpload}
                    helperText="Recommended: 1200x630px"
                    fullWidth
                  />
                )}
              </div>

              {/* Gallery Images */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Gallery Images
                </label>
                <div className="space-y-4">
                  {galleryUrls && galleryUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                    label={galleryImageIds.length === 0 ? undefined : "Add More Images"}
                    accept="image/*"
                    isUploading={isGalleryUploading}
                    error={galleryUploadError ?? undefined}
                    onFileSelect={handleGalleryUpload}
                    helperText="Upload multiple images to create a gallery (JPG, PNG, WebP)"
                    fullWidth
                  />
                  {galleryImageIds.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No gallery images yet. Add images to showcase your project.
                    </p>
                  )}
                </div>
              </div>

              <Input
                {...register("techStack")}
                label="Tech Stack"
                placeholder="React, TypeScript, Tailwind (comma-separated)"
                fullWidth
                helperText="Enter technologies separated by commas"
              />
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
              <Input
                {...register("tags")}
                label="Tags"
                placeholder="frontend, fullstack (comma-separated)"
                fullWidth
                helperText="Tags for categorization"
              />
              <Input
                {...register("sortOrder", { valueAsNumber: true })}
                label="Sort Order"
                type="number"
                placeholder="0"
                fullWidth
                helperText="Lower numbers appear first"
              />
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="rounded border-border"
                />
                Featured Project
              </label>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploading || isGalleryUploading}
                >
                  {isSubmitting ? "Saving..." : "Save as Draft"}
                </Button>
                <Link to="/projects">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
