import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";

export default function Businesses() {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/">
          <Button variant="ghost">&larr; Dashboard</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Search"
                placeholder="Filter businesses..."
                fullWidth
              />
              <p className="text-label-secondary">No businesses yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
