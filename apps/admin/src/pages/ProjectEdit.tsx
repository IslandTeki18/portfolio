import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Spinner } from "@repo/ui/spinner";
import { useEffect } from "react";

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
    id ? { id: id as Id<"projects"> } : "skip"
  );

  const updateProject = useMutation(api.projects.updateProject);
  const publishProject = useMutation(api.projects.publishProject);
  const unpublishProject = useMutation(api.projects.unpublishProject);
  const softDeleteProject = useMutation(api.projects.softDeleteProject);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>();

  // Pre-populate form when project data loads
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
      addToast({
        type: "success",
        message: "Project published successfully",
      });
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
      addToast({
        type: "success",
        message: "Project unpublished successfully",
      });
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
        "Are you sure you want to delete this project? This action can be undone by an admin."
      )
    ) {
      return;
    }
    try {
      await softDeleteProject({ id: id as Id<"projects"> });
      addToast({
        type: "success",
        message: "Project deleted successfully",
      });
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="min-h-screen bg-background-primary p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-destructive">Project not found</p>
          <Link to="/projects">
            <Button variant="ghost" className="mt-4">
              &larr; Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPublished = project.status === "published";

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/projects">
          <Button variant="ghost">&larr; Back to Projects</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-3 text-sm">
              <span className="text-label-secondary">Project ID: {id}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  isPublished
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>

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

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                {isPublished ? (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleUnpublish}
                  >
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handlePublish}
                  >
                    Publish
                  </Button>
                )}
                <Button variant="danger" type="button" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
