import { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { useStorageUrl, useStorageUrls } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Spinner } from "@repo/ui/spinner";
import { Lightbox } from "@repo/ui/lightbox";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = useQuery(
    api.projects.getPublishedProjectBySlug,
    slug ? { slug } : "skip",
  );

  const coverUrl = useStorageUrl(api.storage.getFileUrl, project?.coverImageId);
  const galleryUrls = useStorageUrls(
    api.storage.getFileUrls,
    project?.galleryImageIds as string[] | undefined,
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter gallery URLs to only include loaded images
  const loadedGalleryUrls = useMemo(() => {
    return (
      galleryUrls?.filter((item): item is { url: string; storageId: string } => item.url !== null) ||
      []
    );
  }, [galleryUrls]);

  // Combine cover and gallery images for lightbox
  const allImages = useMemo(() => {
    const images: Array<{ url: string; alt?: string }> = [];
    if (coverUrl && project) {
      images.push({ url: coverUrl, alt: `${project.title} cover` });
    }
    if (project) {
      loadedGalleryUrls.forEach((item, i) => {
        images.push({ url: item.url, alt: `${project.title} gallery ${i + 1}` });
      });
    }
    return images;
  }, [coverUrl, loadedGalleryUrls, project]);

  const handleCoverClick = () => {
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const handleGalleryClick = (index: number) => {
    // Offset by 1 if cover image exists
    const lightboxIdx = coverUrl ? index + 1 : index;
    setLightboxIndex(lightboxIdx);
    setLightboxOpen(true);
  };

  if (!slug) {
    return <Navigate to="/404" replace />;
  }

  if (project === undefined) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="font-mono text-sm text-[#737373]">{"// loading_project..."}</p>
        </div>
      </div>
    );
  }

  if (project === null) {
    return <Navigate to="/404" replace />;
  }

  const projectName = project.title.toLowerCase().replace(/\s+/g, "_");

  return (
    <div className="min-h-screen bg-[#0C0C0C] p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
        {/* Back Button */}
        <Link to="/">
          <button className="font-mono text-xs md:text-sm text-[#737373] hover:text-[#22C55E] transition-colors">
            [← back_to_home]
          </button>
        </Link>

        {/* Cover Image Thumbnail */}
        {coverUrl && (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs md:text-sm text-[#22C55E]">~ cover_image</span>
            <div
              className="border-2 border-[#22C55E] cursor-pointer transition-all hover:brightness-110 hover:scale-105"
              onClick={handleCoverClick}
            >
              <img
                src={coverUrl}
                alt={project.title}
                loading="lazy"
                className="h-[150px] w-[150px] object-cover"
              />
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="border-2 border-[#22C55E] bg-[#171717]">
          {/* Header */}
          <div className="border-b border-[#252525] p-4 md:p-5">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-mono text-[18px] md:text-[24px] font-semibold text-[#22C55E]">&gt;</span>
              <h1 className="font-mono text-[18px] md:text-[24px] font-semibold text-[#E5E5E5] break-all">
                {projectName}
              </h1>
            </div>
            {project.status && (
              <div className="mt-3">
                <span
                  className={`border px-2 py-1 font-mono text-[11px] font-medium ${
                    project.status === "published"
                      ? "border-[#22C55E] text-[#22C55E]"
                      : "border-[#F59E0B] text-[#F59E0B]"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 md:p-5 space-y-4 md:space-y-5">
            {/* Short Description */}
            <p className="font-mono text-[11px] md:text-xs leading-relaxed text-[#A3A3A3]">
              {`// ${project.shortDescription}`}
            </p>

            {/* Long Description */}
            {project.longDescription && (
              <div className="border-l-2 border-[#22C55E] pl-3 md:pl-4 py-2">
                <p className="font-mono text-[11px] md:text-xs leading-relaxed text-[#E5E5E5] whitespace-pre-wrap">
                  {project.longDescription}
                </p>
              </div>
            )}

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="space-y-2 md:space-y-3">
                <h2 className="font-mono text-xs md:text-sm font-medium text-[#22C55E]">~ tech_stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={tech}
                      className={
                        index === 0
                          ? "bg-[#22C55E] px-3 py-1.5 font-mono text-[11px] font-medium text-[#0C0C0C]"
                          : "border border-[#22C55E] px-3 py-1.5 font-mono text-[11px] font-medium text-[#22C55E]"
                      }
                    >
                      {tech.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {(project.liveUrl || project.repoUrl) && (
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                {project.liveUrl && (
                  <button
                    onClick={() => window.open(project.liveUrl, "_blank")}
                    className="bg-[#22C55E] px-4 py-2.5 font-mono text-[11px] md:text-xs font-medium text-[#0C0C0C] hover:bg-[#16A34A] transition-colors text-center"
                  >
                    [view_live_site]
                  </button>
                )}
                {project.repoUrl && (
                  <button
                    onClick={() => window.open(project.repoUrl, "_blank")}
                    className="border border-[#22C55E] px-4 py-2.5 font-mono text-[11px] md:text-xs font-medium text-[#22C55E] hover:bg-[#22C55E] hover:text-[#0C0C0C] transition-colors text-center"
                  >
                    [view_repository]
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {loadedGalleryUrls.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3">
              <h2 className="font-mono text-sm md:text-base font-medium text-[#22C55E]">~ gallery</h2>
              <span className="font-mono text-[10px] md:text-xs text-[#737373]">
                {`// ${loadedGalleryUrls.length} screenshot${loadedGalleryUrls.length !== 1 ? "s" : ""}`}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {loadedGalleryUrls.map((item, index) => (
                <div
                  key={item.storageId}
                  className="border-2 border-[#22C55E] cursor-pointer transition-all hover:brightness-110 hover:scale-105"
                  onClick={() => handleGalleryClick(index)}
                >
                  <img
                    src={item.url}
                    alt="Project gallery"
                    loading="lazy"
                    className="h-[150px] w-[150px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
