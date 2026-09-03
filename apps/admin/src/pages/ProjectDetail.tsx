import { Link, useParams } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { Button } from "@repo/ui/button";
import { Spinner } from "@repo/ui/spinner";
import {
  BackLink,
  Chips,
  DetailField,
  FeaturedTag,
  MetaBar,
  PageTitle,
  StatusPill,
} from "../components/AdminLayout";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = useQuery(
    api.projects.getProjectById,
    id ? { id: id as Id<"projects"> } : "skip",
  );
  const coverUrl = useStorageUrl(api.storage.getFileUrl, project?.coverImageId);

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

  return (
    <>
      <BackLink to="/projects">Projects</BackLink>

      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <StatusPill on={project.status === "published"}>
              {project.status}
            </StatusPill>
            {project.featured && <FeaturedTag />}
            {project.deletedAt && (
              <span className="font-mono text-[11px] tracking-[0.04em] text-destructive">
                deleted
              </span>
            )}
          </div>
          <PageTitle>{project.title}</PageTitle>
          <span className="font-mono text-xs text-label-secondary">
            /{project.slug}
          </span>
        </div>
        <Link to={`/projects/${id}/edit`}>
          <Button variant="outline" size="sm" className="rounded-md whitespace-nowrap border">
            Edit
          </Button>
        </Link>
      </div>

      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          className="w-full rounded-2xl border border-border object-cover"
        />
      )}

      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 border-t border-border pt-7">
        <div className="flex flex-col gap-6">
          <p className="m-0 text-[17px] leading-relaxed text-pretty">
            {project.shortDescription}
          </p>
          {project.longDescription && (
            <p className="m-0 whitespace-pre-wrap text-[15px] leading-[1.7] text-brand-secondary text-pretty">
              {project.longDescription}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {project.techStack && project.techStack.length > 0 && (
            <DetailField label="Stack">
              <Chips items={project.techStack} />
            </DetailField>
          )}
          {project.tags && project.tags.length > 0 && (
            <DetailField label="Tags">
              <Chips items={project.tags} />
            </DetailField>
          )}
          {project.liveUrl && (
            <DetailField label="Live">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm break-all underline-offset-4 hover:underline"
              >
                {project.liveUrl}
              </a>
            </DetailField>
          )}
          {project.repoUrl && (
            <DetailField label="Repo">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm break-all underline-offset-4 hover:underline"
              >
                {project.repoUrl}
              </a>
            </DetailField>
          )}
        </div>
      </div>

      <MetaBar
        items={[
          `sort ${project.sortOrder ?? "—"}`,
          `created ${new Date(project.createdAt).toLocaleDateString()}`,
          `updated ${new Date(project.updatedAt).toLocaleDateString()}`,
          `id ${id}`,
        ]}
      />
    </>
  );
}
