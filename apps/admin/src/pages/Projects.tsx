import { Link } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Spinner } from "@repo/ui/spinner";
import { EmptyState } from "@repo/ui/empty-state";

export default function Projects() {
  const projects = useQuery(api.projects.listAllProjects);

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost">&larr; Dashboard</Button>
          </Link>
          <Link to="/projects/new">
            <Button variant="primary">Create Project</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects === undefined ? (
              <div className="flex justify-center py-8">
                <Spinner variant="primary" size="lg" />
              </div>
            ) : projects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create your first project to get started"
              />
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="block"
                  >
                    <div className="rounded-lg border border-border bg-card p-4 hover:bg-muted transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {project.title}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                project.status === "published"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {project.status}
                            </span>
                            {project.featured && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                featured
                              </span>
                            )}
                            {project.deletedAt && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                deleted
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.shortDescription}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>/{project.slug}</span>
                            {project.techStack && project.techStack.length > 0 && (
                              <span>
                                {project.techStack.slice(0, 3).join(", ")}
                                {project.techStack.length > 3 && "..."}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
