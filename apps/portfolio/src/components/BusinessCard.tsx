import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import type { Business } from "../types/convex";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{business.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-label-secondary text-sm mb-4">
          {business.shortDescription}
        </p>
        {business.websiteUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(business.websiteUrl, "_blank")}
          >
            Visit Website
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
