import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Spinner } from "@repo/ui/spinner";

export default function BusinessDetail() {
  const { slug } = useParams<{ slug: string }>();
  const business = useQuery(
    api.businesses.getPublishedBusinessBySlug,
    slug ? { slug } : "skip",
  );

  const logoUrl = useStorageUrl(api.storage.getFileUrl, business?.logoImageId);

  if (!slug) {
    return <Navigate to="/404" replace />;
  }

  if (business === undefined) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="font-mono text-sm text-[#737373]">{"// loading_business..."}</p>
        </div>
      </div>
    );
  }

  if (business === null) {
    return <Navigate to="/404" replace />;
  }

  const businessName = business.name.toLowerCase().replace(/\s+/g, "_");

  return (
    <div className="min-h-screen bg-[#0C0C0C] p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
        {/* Back Button */}
        <Link to="/">
          <button className="font-mono text-xs md:text-sm text-[#737373] hover:text-[#3B82F6] transition-colors">
            [← back_to_home]
          </button>
        </Link>

        {/* Main Content Card */}
        <div className="border-2 border-[#3B82F6] bg-[#171717]">
          {/* Header with Logo */}
          <div className="border-b border-[#252525] p-4 md:p-5">
            <div className="flex items-center gap-2 md:gap-3">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={`${business.name} logo`}
                  loading="lazy"
                  className="h-8 w-8 md:h-10 md:w-10 object-contain flex-shrink-0"
                />
              )}
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <span className="font-mono text-[18px] md:text-[24px] font-semibold text-[#3B82F6]">&gt;</span>
                <h1 className="font-mono text-[18px] md:text-[24px] font-semibold text-[#E5E5E5] break-all">
                  {businessName}
                </h1>
              </div>
            </div>
            {business.active && (
              <div className="mt-3">
                <span className="border border-[#22C55E] px-2 py-1 font-mono text-[11px] font-medium text-[#22C55E]">
                  active
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 md:p-5 space-y-4 md:space-y-5">
            {/* Short Description */}
            <p className="font-mono text-[11px] md:text-xs leading-relaxed text-[#A3A3A3]">
              {`// ${business.shortDescription}`}
            </p>

            {/* Long Description */}
            {business.longDescription && (
              <div className="border-l-2 border-[#3B82F6] pl-3 md:pl-4 py-2">
                <p className="font-mono text-[11px] md:text-xs leading-relaxed text-[#E5E5E5] whitespace-pre-wrap">
                  {business.longDescription}
                </p>
              </div>
            )}

            {/* Tags */}
            {business.tags && business.tags.length > 0 && (
              <div className="space-y-2 md:space-y-3">
                <h2 className="font-mono text-xs md:text-sm font-medium text-[#3B82F6]">~ categories</h2>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#3B82F6] px-3 py-1.5 font-mono text-[11px] font-medium text-[#3B82F6]"
                    >
                      {tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Website Button */}
            {business.websiteUrl && (
              <div className="pt-2">
                <button
                  onClick={() => window.open(business.websiteUrl, "_blank")}
                  className="w-full sm:w-auto bg-[#3B82F6] px-4 py-2.5 font-mono text-[11px] md:text-xs font-medium text-[#0C0C0C] hover:bg-[#2563EB] transition-colors text-center"
                >
                  [visit_website]
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
