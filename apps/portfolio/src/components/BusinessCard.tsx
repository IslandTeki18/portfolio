import { Link } from "react-router-dom";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { cn } from "@repo/ui/lib/utils";
import type { Business } from "../types/convex";
import Chip from "./Chip";
import { CARD, CARD_HOVER, PLACEHOLDER_ART } from "./styles";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const logoUrl = useStorageUrl(api.storage.getFileUrl, business.logoImageId);

  return (
    <Link
      to={`/businesses/${business.slug}`}
      className={cn(CARD, CARD_HOVER, "flex flex-col gap-[18px] p-[26px]")}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className={cn("h-11 w-11 shrink-0 overflow-hidden rounded-xl", PLACEHOLDER_ART)}>
            {logoUrl && (
              <img src={logoUrl} alt={`${business.name} logo`} loading="lazy" className="h-full w-full object-cover" />
            )}
          </div>
          <h3 className="truncate text-[19px] font-semibold tracking-[-0.015em]">{business.name}</h3>
        </div>
        {business.active && <Chip dot>Active</Chip>}
      </div>
      <p className="text-[15px] leading-relaxed text-fg-muted text-pretty">{business.shortDescription}</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {business.tags?.slice(0, 3).map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
        {business.websiteUrl && (
          <a
            href={business.websiteUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="whitespace-nowrap text-sm font-medium text-accent hover:text-accent-hover"
          >
            Visit site →
          </a>
        )}
      </div>
    </Link>
  );
}
