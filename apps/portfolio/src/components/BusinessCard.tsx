import { Link } from "react-router-dom";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import type { Business } from "../types/convex";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const logoUrl = useStorageUrl(api.storage.getFileUrl, business.logoImageId);

  return (
    <Link to={`/businesses/${business.slug}`}>
      <div className="border border-[#1F1F1F] bg-[#1A1A1A] p-3 md:p-4 hover:border-[#3B82F6]">
        <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${business.name} logo`}
              loading="lazy"
              className="h-10 w-10 md:h-12 md:w-12 object-contain flex-shrink-0"
            />
          )}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs md:text-sm font-medium text-[#3B82F6]">&gt;</span>
            <h3 className="font-mono text-xs md:text-sm font-medium text-[#E5E5E5] lowercase break-all">
              {business.name.toLowerCase().replace(/\s+/g, "_")}
            </h3>
          </div>
        </div>
        {business.active && (
          <span className="border border-[#22C55E] px-2 py-1 font-mono text-[10px] md:text-[11px] font-medium text-[#22C55E] flex-shrink-0">
            active
          </span>
        )}
      </div>
      <p className="mt-2 md:mt-3 font-mono text-[11px] md:text-xs leading-relaxed text-[#A3A3A3]">
        {`// ${business.shortDescription}`}
      </p>
      {business.tags && business.tags.length > 0 && (
        <div className="mt-2 md:mt-3 flex flex-wrap gap-2">
          {business.tags.map((tag) => (
            <span
              key={tag}
              className="border border-[#3B82F6] px-2 py-1 font-mono text-[10px] md:text-[11px] font-medium text-[#3B82F6]"
            >
              {tag.toLowerCase()}
            </span>
          ))}
        </div>
      )}
        {business.websiteUrl && (
          <div className="mt-2 md:mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                window.open(business.websiteUrl, "_blank");
              }}
              className="bg-[#3B82F6] px-3 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-xs font-medium text-[#0C0C0C] hover:bg-[#2563EB]"
            >
              [visit_website]
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
