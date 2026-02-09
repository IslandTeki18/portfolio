import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import type { Project } from "../types/convex";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-label-secondary text-sm">
            {project.shortDescription}
          </p>
          {project.techStack && project.techStack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
