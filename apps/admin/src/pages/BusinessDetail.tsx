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

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const business = useQuery(
    api.businesses.getBusinessById,
    id ? { id: id as Id<"businesses"> } : "skip",
  );
  const logoUrl = useStorageUrl(api.storage.getFileUrl, business?.logoImageId);

  if (business === undefined) {
    return <Spinner variant="primary" size="lg" className="py-24" />;
  }

  if (business === null) {
    return (
      <>
        <BackLink to="/businesses">Businesses</BackLink>
        <p className="text-destructive">Business not found</p>
      </>
    );
  }

  return (
    <>
      <BackLink to="/businesses">Businesses</BackLink>

      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="size-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-background-secondary">
            {logoUrl && (
              <img
                src={logoUrl}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <StatusPill on={business.active}>
                {business.active ? "active" : "inactive"}
              </StatusPill>
              {business.featured && <FeaturedTag />}
              {business.deletedAt && (
                <span className="font-mono text-[11px] tracking-[0.04em] text-destructive">
                  deleted
                </span>
              )}
            </div>
            <PageTitle>{business.name}</PageTitle>
            {business.websiteUrl && (
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-label-secondary underline-offset-4 hover:underline"
              >
                {business.websiteUrl} &#8599;
              </a>
            )}
          </div>
        </div>
        <Link to={`/businesses/${id}/edit`}>
          <Button variant="outline" size="sm" className="rounded-md whitespace-nowrap border">
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 border-t border-border pt-7">
        <div className="flex flex-col gap-6">
          <p className="m-0 text-[17px] leading-relaxed text-pretty">
            {business.shortDescription}
          </p>
          {business.longDescription && (
            <p className="m-0 whitespace-pre-wrap text-[15px] leading-[1.7] text-brand-secondary text-pretty">
              {business.longDescription}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {business.tags && business.tags.length > 0 && (
            <DetailField label="Tags">
              <Chips items={business.tags} />
            </DetailField>
          )}
          <DetailField label="Slug">
            <span className="font-mono text-[13px]">/{business.slug}</span>
          </DetailField>
        </div>
      </div>

      <MetaBar items={[`sort ${business.sortOrder ?? "—"}`, `id ${id}`]} />
    </>
  );
}
