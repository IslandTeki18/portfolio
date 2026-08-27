import { Link } from "react-router-dom";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { cn } from "@repo/ui/lib/utils";
import type { Project } from "../types/convex";
import Chip from "./Chip";
import { CARD, CARD_HOVER, PLACEHOLDER_ART } from "./styles";

interface ProjectCardProps {
  project: Project;
  index: number;
  /** Wide two-column layout spanning the grid. */
  featured?: boolean;
}

export function projectStatus(project: Project): string {
  const year = new Date(project.createdAt).getFullYear();
  return `${project.liveUrl ? "Live" : "Project"} · ${year}`;
}

export default function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const coverUrl = useStorageUrl(api.storage.getFileUrl, project.coverImageId);
  const number = String(index + 1).padStart(2, "0");

  const art = (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden",
        PLACEHOLDER_ART,
        featured
          ? "h-[220px] border-t border-line md:h-[340px] md:border-t-0 md:border-l"
          : "h-[190px] border-b border-line",
      )}
    >
      {coverUrl ? (
        <img src={coverUrl} alt={project.title} loading="lazy" className="h-full w-full object-cover object-top" />
      ) : (
        <span className="font-mono text-xs text-fg-ghost">{project.title.toLowerCase()}</span>
      )}
    </div>
  );

  const meta = (
    <div className="flex items-center gap-2.5 font-mono text-xs">
      <span className="text-fg-faint">{number}</span>
      <span className={project.liveUrl ? "text-accent" : "text-fg-faint"}>{projectStatus(project)}</span>
    </div>
  );

  const chips = project.techStack && project.techStack.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {project.techStack.slice(0, featured ? 4 : 3).map((tech) => (
        <Chip key={tech}>{tech}</Chip>
      ))}
    </div>
  );

  if (featured) {
    return (
      <Link
        to={`/projects/${project.slug}`}
        className={cn(CARD, CARD_HOVER, "grid overflow-hidden md:col-span-2 md:grid-cols-[1.05fr_1fr]")}
      >
        <div className="flex flex-col justify-between gap-7 p-6 md:p-8">
          <div>
            {meta}
            <h3 className="mt-3.5 text-[22px] font-semibold tracking-[-0.02em] md:text-[26px]">{project.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-fg-muted text-pretty">{project.shortDescription}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            {chips || <span />}
            <span className="whitespace-nowrap text-sm font-medium text-accent">Case study →</span>
          </div>
        </div>
        {art}
      </Link>
    );
  }

  return (
    <Link to={`/projects/${project.slug}`} className={cn(CARD, CARD_HOVER, "flex flex-col overflow-hidden")}>
      {art}
      <div className="flex flex-1 flex-col gap-[18px] p-[26px]">
        <div>
          {meta}
          <h3 className="mt-3 text-[21px] font-semibold tracking-[-0.015em]">{project.title}</h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-fg-muted text-pretty">{project.shortDescription}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          {chips || <span />}
          <span className="whitespace-nowrap text-sm font-medium text-accent">→</span>
        </div>
      </div>
    </Link>
  );
}
