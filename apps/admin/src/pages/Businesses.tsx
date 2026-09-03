import { Link } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { Button } from "@repo/ui/button";
import { Spinner } from "@repo/ui/spinner";
import { EmptyState } from "@repo/ui/empty-state";
import { FeaturedTag, PageHeader, StatusPill } from "../components/AdminLayout";

function host(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function Businesses() {
  const businesses = useQuery(api.businesses.listAllBusinesses);

  return (
    <>
      <PageHeader
        title="Businesses"
        action={
          <Link to="/businesses/new">
            <Button variant="primary" size="sm" className="rounded-md">
              New business
            </Button>
          </Link>
        }
      />

      {businesses === undefined ? (
        <Spinner variant="primary" size="lg" className="py-16" />
      ) : businesses.length === 0 ? (
        <EmptyState
          title="No businesses yet"
          description="Create your first business to get started"
        />
      ) : (
        <div className="flex flex-col border-t border-border">
          {businesses.map((business, index) => (
            <Link
              key={business._id}
              to={`/businesses/${business._id}`}
              className="grid grid-cols-[28px_1fr_auto] items-start gap-4 border-b border-border px-1 py-5 transition-colors hover:bg-background-secondary"
            >
              <span className="pt-0.5 font-mono text-xs text-label-secondary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[17px] font-semibold tracking-[-0.01em]">
                    {business.name}
                  </span>
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
                <p className="m-0 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {business.shortDescription}
                </p>
                {business.websiteUrl && (
                  <span className="font-mono text-xs text-label-secondary">
                    {host(business.websiteUrl)}
                  </span>
                )}
              </div>
              <span className="whitespace-nowrap pt-1 font-mono text-xs text-label-secondary">
                /{business.slug}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
