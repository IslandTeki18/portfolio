import { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { useStorageUrl, useStorageUrls } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Spinner } from "@repo/ui/spinner";
import { Lightbox } from "@repo/ui/lightbox";
import { cn } from "@repo/ui/lib/utils";
import Chip from "../components/Chip";
import Footer from "../components/Footer";
import { projectStatus } from "../components/ProjectCard";
import { BTN_PILL, BTN_PRIMARY, BTN_SECONDARY, EYEBROW, LABEL, PLACEHOLDER_ART } from "../components/styles";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = useQuery(api.projects.getPublishedProjectBySlug, slug ? { slug } : "skip");

  const coverUrl = useStorageUrl(api.storage.getFileUrl, project?.coverImageId);
  const galleryUrls = useStorageUrls(api.storage.getFileUrls, project?.galleryImageIds as string[] | undefined);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const loadedGalleryUrls = useMemo(
    () => galleryUrls?.filter((item): item is { url: string; storageId: string } => item.url !== null) ?? [],
    [galleryUrls],
  );

  const allImages = useMemo(() => {
    if (!project) return [];
    const images: Array<{ url: string; alt?: string }> = [];
    if (coverUrl) images.push({ url: coverUrl, alt: `${project.title} cover` });
    loadedGalleryUrls.forEach((item, i) => images.push({ url: item.url, alt: `${project.title} gallery ${i + 1}` }));
    return images;
  }, [coverUrl, loadedGalleryUrls, project]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!slug || project === null) return <Navigate to="/404" replace />;

  if (project === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-view-in">
      <div className="mx-auto max-w-[940px] px-5 pt-8 pb-24 md:px-8 md:pt-10">
        <Link to="/#work" className={cn(BTN_PILL, "font-mono text-[13px] text-fg-muted py-[9px] pr-4 pl-3")}>
          ← Back to work
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs">
          <span className={EYEBROW}>Case study</span>
          <span className="text-fg-faint">{projectStatus(project)}</span>
        </div>
        <h1 className="mt-3.5 text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[44px]">{project.title}</h1>
        <p className="mt-[18px] max-w-[640px] text-lg leading-relaxed text-fg-muted text-pretty md:text-[19px]">
          {project.shortDescription}
        </p>

        <div
          className={cn(
            "mt-9 flex h-[240px] items-center justify-center overflow-hidden rounded-2xl border border-line md:h-[380px]",
            PLACEHOLDER_ART,
            coverUrl && "cursor-zoom-in",
          )}
          onClick={coverUrl ? () => openLightbox(0) : undefined}
        >
          {coverUrl ? (
            <img src={coverUrl} alt={project.title} className="h-full w-full object-cover object-top" />
          ) : (
            <span className="font-mono text-[13px] text-fg-ghost">no cover image</span>
          )}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5">
            {project.longDescription ? (
              project.longDescription.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="text-base leading-[1.75] text-fg-body text-pretty whitespace-pre-line">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-base leading-[1.75] text-fg-body">{project.shortDescription}</p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {project.techStack && project.techStack.length > 0 && (
              <div>
                <p className={cn(LABEL, "mb-3")}>Stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Chip key={tech}>{tech}</Chip>
                  ))}
                </div>
              </div>
            )}
            {project.tags && project.tags.length > 0 && (
              <div>
                <p className={cn(LABEL, "mb-3")}>Tags</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              </div>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className={cn(BTN_PRIMARY, "px-[22px] py-3")}>
                View live site
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className={cn(BTN_SECONDARY, "px-[22px] py-3")}>
                View repository
              </a>
            )}
          </div>
        </div>

        {loadedGalleryUrls.length > 0 && (
          <div className="mt-12">
            <p className={cn(LABEL, "mb-4")}>Gallery</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {loadedGalleryUrls.map((item, index) => (
                <button
                  key={item.storageId}
                  type="button"
                  onClick={() => openLightbox(coverUrl ? index + 1 : index)}
                  className={cn(
                    "h-[170px] overflow-hidden rounded-xl border border-line transition-transform duration-300 ease-soft hover:scale-[1.03]",
                    PLACEHOLDER_ART,
                  )}
                >
                  <img src={item.url} alt={`${project.title} gallery ${index + 1}`} loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <Footer />
      </div>

      <Lightbox images={allImages} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
}
