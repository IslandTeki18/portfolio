import { Link, useParams } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Spinner } from "@repo/ui/spinner";

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const business = useQuery(
    api.businesses.getBusinessById,
    id ? { id: id as Id<"businesses"> } : "skip"
  );

  if (business === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (business === null) {
    return (
      <div className="min-h-screen bg-background-primary p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-destructive">Business not found</p>
          <Link to="/businesses">
            <Button variant="ghost" className="mt-4">
              &larr; Back to Businesses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isDeleted = business.deletedAt !== null;

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/businesses">
            <Button variant="ghost">&larr; Back to Businesses</Button>
          </Link>
          <Link to={`/businesses/${id}/edit`}>
            <Button variant="primary">Edit Business</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle>{business.name}</CardTitle>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    business.active
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {business.active ? "Active" : "Inactive"}
                </span>
                {business.featured && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Featured
                  </span>
                )}
                {isDeleted && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Deleted
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Slug */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Slug</h3>
              <p className="text-foreground font-mono text-sm">/{business.slug}</p>
            </div>

            {/* Short Description */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Short Description
              </h3>
              <p className="text-foreground">{business.shortDescription}</p>
            </div>

            {/* Long Description */}
            {business.longDescription && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Long Description
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {business.longDescription}
                </p>
              </div>
            )}

            {/* Website URL */}
            {business.websiteUrl && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Website
                </h3>
                <a
                  href={business.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm break-all"
                >
                  {business.websiteUrl}
                </a>
              </div>
            )}

            {/* Tags */}
            {business.tags && business.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {business.sortOrder !== undefined && (
                <div>
                  <h3 className="text-muted-foreground mb-1">Sort Order</h3>
                  <p className="text-foreground font-medium">{business.sortOrder}</p>
                </div>
              )}
            </div>

            {/* Business ID */}
            <div className="border-t border-border pt-4">
              <h3 className="text-xs font-medium text-muted-foreground mb-1">
                Business ID
              </h3>
              <p className="text-xs font-mono text-muted-foreground">{id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
