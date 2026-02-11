import { Link } from "react-router-dom";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import type { Project } from "../types/convex";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const coverUrl = useStorageUrl(api.storage.getFileUrl, project.coverImageId);

  return (
    <Link to={`/projects/${project.slug}`}>
      <div className="border border-[#1F1F1F] bg-[#1A1A1A] p-3 md:p-4 transition-colors hover:border-[#22C55E]">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={project.title}
            loading="lazy"
            className="mb-3 h-28 md:h-32 w-full object-cover"
          />
        )}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs md:text-sm font-medium text-[#22C55E]">&gt;</span>
          <h3 className="font-mono text-xs md:text-sm font-medium text-[#E5E5E5] lowercase break-all">
            {project.title.toLowerCase().replace(/\s+/g, "_")}
          </h3>
        </div>
        <p className="mt-2 md:mt-3 font-mono text-[11px] md:text-xs leading-relaxed text-[#A3A3A3]">
          {`// ${project.shortDescription}`}
        </p>
        {project.techStack && project.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <span
                key={tech}
                className={`border px-2 py-1 font-mono text-[11px] font-medium ${
                  index === 0
                    ? "border-[#22C55E] bg-[#22C55E] text-[#0C0C0C]"
                    : "border-[#22C55E] bg-transparent text-[#22C55E]"
                }`}
              >
                {tech.toLowerCase()}
              </span>
            ))}
          </div>
        )}
        <div className="mt-2 md:mt-3 flex flex-wrap gap-2">
          {project.liveUrl && (
            <span className="bg-[#22C55E] px-3 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-xs font-medium text-[#0C0C0C]">
              [view_live]
            </span>
          )}
          {project.repoUrl && (
            <span className="border border-[#737373] bg-transparent px-3 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-xs font-medium text-[#737373]">
              [source_code]
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
