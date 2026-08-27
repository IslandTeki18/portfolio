import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Spinner } from "@repo/ui/spinner";
import { cn } from "@repo/ui/lib/utils";
import Chip from "../components/Chip";
import Footer from "../components/Footer";
import { BTN_PILL, BTN_PRIMARY, EYEBROW, LABEL, PLACEHOLDER_ART } from "../components/styles";

export default function BusinessDetail() {
  const { slug } = useParams<{ slug: string }>();
  const business = useQuery(api.businesses.getPublishedBusinessBySlug, slug ? { slug } : "skip");
  const logoUrl = useStorageUrl(api.storage.getFileUrl, business?.logoImageId);

  if (!slug || business === null) return <Navigate to="/404" replace />;

  if (business === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-view-in">
      <div className="mx-auto max-w-[940px] px-5 pt-8 pb-24 md:px-8 md:pt-10">
        <Link to="/#ventures" className={cn(BTN_PILL, "font-mono text-[13px] text-fg-muted py-[9px] pr-4 pl-3")}>
          ← Back to ventures
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <div className={cn("h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line", PLACEHOLDER_ART)}>
            {logoUrl && <img src={logoUrl} alt={`${business.name} logo`} className="h-full w-full object-cover" />}
          </div>
          <div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className={EYEBROW}>Venture</span>
              {business.active && <Chip dot>Active</Chip>}
            </div>
            <h1 className="mt-2 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[44px]">{business.name}</h1>
          </div>
        </div>
        <p className="mt-[18px] max-w-[640px] text-lg leading-relaxed text-fg-muted text-pretty md:text-[19px]">
          {business.shortDescription}
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5">
            {business.longDescription &&
              business.longDescription.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="text-base leading-[1.75] text-fg-body text-pretty whitespace-pre-line">
                  {para}
                </p>
              ))}
          </div>
          <div className="flex flex-col gap-6">
            {business.tags && business.tags.length > 0 && (
              <div>
                <p className={cn(LABEL, "mb-3")}>Categories</p>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              </div>
            )}
            {business.websiteUrl && (
              <a href={business.websiteUrl} target="_blank" rel="noreferrer" className={cn(BTN_PRIMARY, "px-[22px] py-3")}>
                Visit website
              </a>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
