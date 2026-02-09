import { Link } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Spinner } from "@repo/ui/spinner";
import { EmptyState } from "@repo/ui/empty-state";

export default function Businesses() {
  const businesses = useQuery(api.businesses.listAllBusinesses);

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost">&larr; Dashboard</Button>
          </Link>
          <Link to="/businesses/new">
            <Button variant="primary">Create Business</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            {businesses === undefined ? (
              <div className="flex justify-center py-8">
                <Spinner variant="primary" size="lg" />
              </div>
            ) : businesses.length === 0 ? (
              <EmptyState
                title="No businesses yet"
                description="Create your first business to get started"
              />
            ) : (
              <div className="space-y-3">
                {businesses.map((business) => (
                  <Link
                    key={business._id}
                    to={`/businesses/${business._id}`}
                    className="block"
                  >
                    <div className="rounded-lg border border-border bg-card p-4 hover:bg-muted transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {business.name}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                business.active
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {business.active ? "active" : "inactive"}
                            </span>
                            {business.featured && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                featured
                              </span>
                            )}
                            {business.deletedAt && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                deleted
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {business.shortDescription}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>/{business.slug}</span>
                            {business.websiteUrl && (
                              <span className="truncate">{business.websiteUrl}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
