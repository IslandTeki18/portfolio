import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@repo/lib/convex";
import { useUpload } from "@repo/lib/use-upload";
import { useStorageUrl, useStorageUrls } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Spinner } from "@repo/ui/spinner";
import { FileUpload, ImagePreview } from "@repo/ui/file-upload";
import {
  BackLink,
  CheckboxField,
  DangerLink,
  PageHeader,
  Section,
  StatusPill,
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

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const project = useQuery(
    api.projects.getProjectById,
    id ? { id: id as Id<"projects"> } : "skip",
  );

  const updateProject = useMutation(api.projects.updateProject);
  const publishProject = useMutation(api.projects.publishProject);
  const unpublishProject = useMutation(api.projects.unpublishProject);
  const softDeleteProject = useMutation(api.projects.softDeleteProject);
  const removeProjectCoverImage = useMutation(api.storage.removeProjectCoverImage);
  const addProjectGalleryImage = useMutation(api.storage.addProjectGalleryImage);
  const removeProjectGalleryImage = useMutation(api.storage.removeProjectGalleryImage);
  const reorderProjectGalleryImages = useMutation(api.storage.reorderProjectGalleryImages);

  const { upload: uploadCover, isUploading: isCoverUploading, error: coverUploadError } =
    useUpload(api.storage.generateUploadUrl);
  const { upload: uploadGallery, isUploading: isGalleryUploading, error: galleryUploadError } =
    useUpload(api.storage.generateUploadUrl);

  const coverUrl = useStorageUrl(api.storage.getFileUrl, project?.coverImageId);
  const galleryUrls = useStorageUrls(
    api.storage.getFileUrls,
    project?.galleryImageIds as string[] | undefined,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>();

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        longDescription: project.longDescription || "",
        techStack: project.techStack?.join(", ") || "",
        liveUrl: project.liveUrl || "",
        repoUrl: project.repoUrl || "",
        tags: project.tags?.join(", ") || "",
        sortOrder: project.sortOrder,
        featured: project.featured || false,
      });
    }
  }, [project, reset]);

  const handleCoverUpload = async (file: File) => {
    if (!id) return;
    try {
      const storageId = await uploadCover(file);
      await updateProject({
        id: id as Id<"projects">,
        coverImageId: storageId as Id<"_storage">,
      });
      addToast({ type: "success", message: "Cover image uploaded" });
    } catch {
      addToast({ type: "error", message: "Failed to upload cover image" });
    }
  };

  const handleRemoveCover = async () => {
    if (!id) return;
    try {
      await removeProjectCoverImage({ id: id as Id<"projects"> });
      addToast({ type: "success", message: "Cover image removed" });
    } catch {
      addToast({ type: "error", message: "Failed to remove cover image" });
    }
  };

  const handleGalleryUpload = async (file: File) => {
    if (!id) return;
    try {
      const storageId = await uploadGallery(file);
      await addProjectGalleryImage({
        projectId: id as Id<"projects">,
        storageId: storageId as Id<"_storage">,
      });
      addToast({ type: "success", message: "Gallery image added" });
    } catch {
      addToast({ type: "error", message: "Failed to upload gallery image" });
    }
  };

  const handleRemoveGalleryImage = async (storageId: string) => {
    if (!id) return;
    try {
      await removeProjectGalleryImage({
        projectId: id as Id<"projects">,
        storageId: storageId as Id<"_storage">,
      });
      addToast({ type: "success", message: "Gallery image removed" });
    } catch {
      addToast({ type: "error", message: "Failed to remove gallery image" });
    }
  };

  const handleMoveGalleryImage = async (index: number, direction: "up" | "down") => {
    if (!id || !project?.galleryImageIds) return;
    const ids = [...project.galleryImageIds];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ids.length) return;

    [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
    try {
      await reorderProjectGalleryImages({
        projectId: id as Id<"projects">,
        orderedIds: ids,
      });
    } catch {
      addToast({ type: "error", message: "Failed to reorder gallery" });
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!id) return;

    try {
      await updateProject({
        id: id as Id<"projects">,
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription || undefined,
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
        message: "Project updated successfully",
      });
      navigate("/projects");
    } catch (error) {
      console.error("Failed to update project:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update project",
      });
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    try {
      await publishProject({ id: id as Id<"projects"> });
      addToast({ type: "success", message: "Project published successfully" });
      navigate("/projects");
    } catch (error) {
      console.error("Failed to publish project:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to publish project",
      });
    }
  };

  const handleUnpublish = async () => {
    if (!id) return;
    try {
      await unpublishProject({ id: id as Id<"projects"> });
      addToast({ type: "success", message: "Project unpublished successfully" });
      navigate("/projects");
    } catch (error) {
      console.error("Failed to unpublish project:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to unpublish project",
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (
      !confirm(
        "Are you sure you want to delete this project? This action can be undone by an admin.",
      )
    ) {
      return;
    }
    try {
      await softDeleteProject({ id: id as Id<"projects"> });
      addToast({ type: "success", message: "Project deleted successfully" });
      navigate("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to delete project",
      });
    }
  };

  if (project === undefined) {
    return <Spinner variant="primary" size="lg" className="py-24" />;
  }

  if (project === null) {
    return (
      <>
        <BackLink to="/projects">Projects</BackLink>
        <p className="text-destructive">Project not found</p>
      </>
    );
  }

  const isPublished = project.status === "published";

  return (
    <>
      <BackLink to={`/projects/${id}`}>{project.title}</BackLink>
      <PageHeader
        title="Edit project"
        action={<StatusPill on={isPublished}>{project.status}</StatusPill>}
      />

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
          {project.coverImageId && coverUrl ? (
            <div>
              <span className="mb-1.5 block text-[13px] font-medium text-muted-foreground">
                Cover
              </span>
              <ImagePreview
                url={coverUrl}
                alt="Cover image"
                size="lg"
                onRemove={handleRemoveCover}
              />
            </div>
          ) : (
            <FileUpload
              label="Cover"
              accept="image/*"
              isUploading={isCoverUploading}
              error={coverUploadError ?? undefined}
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
                    <div key={item.storageId} className="relative">
                      <ImagePreview
                        url={item.url}
                        alt={`Gallery image ${index + 1}`}
                        size="lg"
                        onRemove={() => handleRemoveGalleryImage(item.storageId)}
                        className="w-full"
                      />
                      <div className="mt-1 flex justify-center gap-1">
                        <button
                          type="button"
                          className="rounded px-2 py-0.5 font-mono text-xs text-label-secondary hover:text-label-primary disabled:opacity-30"
                          disabled={index === 0}
                          onClick={() => handleMoveGalleryImage(index, "up")}
                        >
                          &larr;
                        </button>
                        <button
                          type="button"
                          className="rounded px-2 py-0.5 font-mono text-xs text-label-secondary hover:text-label-primary disabled:opacity-30"
                          disabled={index === galleryUrls.length - 1}
                          onClick={() => handleMoveGalleryImage(index, "down")}
                        >
                          &rarr;
                        </button>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            )}
            <FileUpload
              accept="image/*"
              isUploading={isGalleryUploading}
              error={galleryUploadError ?? undefined}
              onFileSelect={handleGalleryUpload}
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

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div className="flex gap-2.5">
            <Button type="submit" disabled={isSubmitting} size="sm" className="rounded-md">
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="rounded-md border"
              onClick={isPublished ? handleUnpublish : handlePublish}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
          <DangerLink onClick={handleDelete}>Delete project</DangerLink>
        </div>
      </form>
    </>
  );
}
