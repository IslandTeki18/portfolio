import { Link, useParams } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Spinner } from "@repo/ui/spinner";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = useQuery(
    api.projects.getProjectById,
    id ? { id: id as Id<"projects"> } : "skip"
  );

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
  const isDeleted = project.deletedAt !== null;

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/projects">
            <Button variant="ghost">&larr; Back to Projects</Button>
          </Link>
          <Link to={`/projects/${id}/edit`}>
            <Button variant="primary">Edit Project</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle>{project.title}</CardTitle>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    isPublished
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {isPublished ? "Published" : "Draft"}
                </span>
                {project.featured && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Featured
                  </span>
                )}
                {isDeleted && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Deleted
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Slug */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Slug</h3>
              <p className="text-foreground font-mono text-sm">/{project.slug}</p>
            </div>

            {/* Short Description */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Short Description
              </h3>
              <p className="text-foreground">{project.shortDescription}</p>
            </div>

            {/* Long Description */}
            {project.longDescription && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Long Description
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {project.longDescription}
                </p>
              </div>
            )}

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.liveUrl && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Live URL
                  </h3>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    {project.liveUrl}
                  </a>
                </div>
              )}
              {project.repoUrl && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Repository URL
                  </h3>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    {project.repoUrl}
                  </a>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {project.sortOrder !== undefined && (
                <div>
                  <h3 className="text-muted-foreground mb-1">Sort Order</h3>
                  <p className="text-foreground font-medium">{project.sortOrder}</p>
                </div>
              )}
              <div>
                <h3 className="text-muted-foreground mb-1">Created</h3>
                <p className="text-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-muted-foreground mb-1">Last Updated</h3>
                <p className="text-foreground">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Project ID */}
            <div className="border-t border-border pt-4">
              <h3 className="text-xs font-medium text-muted-foreground mb-1">
                Project ID
              </h3>
              <p className="text-xs font-mono text-muted-foreground">{id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
