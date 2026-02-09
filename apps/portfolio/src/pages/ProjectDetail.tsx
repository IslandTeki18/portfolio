import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Spinner } from "@repo/ui/spinner";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = useQuery(
    api.projects.getPublishedProjectBySlug,
    slug ? { slug } : "skip"
  );

  if (!slug) {
    return <Navigate to="/404" replace />;
  }

  // Loading state
  if (project === undefined) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Project not found or not published
  if (project === null) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/">
          <Button variant="ghost">&larr; Back</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-label-secondary">{project.shortDescription}</p>

            {project.longDescription && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {project.longDescription}
                </p>
              </div>
            )}

            {project.techStack && project.techStack.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded bg-muted text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(project.liveUrl || project.repoUrl) && (
              <div className="flex gap-3">
                {project.liveUrl && (
                  <Button
                    variant="primary"
                    onClick={() => window.open(project.liveUrl, "_blank")}
                  >
                    View Live Site
                  </Button>
                )}
                {project.repoUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(project.repoUrl, "_blank")}
                  >
                    View Repository
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
