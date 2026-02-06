import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Textarea } from "@repo/ui/textarea";

export default function Resume() {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/">
          <Button variant="ghost">&larr; Dashboard</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                label="Bio"
                placeholder="Write your bio..."
                rows={6}
                fullWidth
              />
              <Button variant="primary">Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
