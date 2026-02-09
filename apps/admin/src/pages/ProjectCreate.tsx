import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>();

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject({
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
                <Button type="submit" disabled={isSubmitting}>
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
