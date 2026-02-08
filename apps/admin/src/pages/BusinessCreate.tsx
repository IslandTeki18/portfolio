import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";

export default function BusinessCreate() {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/businesses">
          <Button variant="ghost">&larr; Back to Businesses</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create Business</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input label="Name" placeholder="Business name" required fullWidth />
              <Input label="Slug" placeholder="business-slug" required fullWidth />
              <Textarea
                label="Short Description"
                placeholder="Brief summary..."
                rows={2}
                required
                fullWidth
              />
              <Textarea
                label="Long Description"
                placeholder="Detailed description..."
                rows={6}
                fullWidth
              />
              <Input label="Website URL" type="url" placeholder="https://..." fullWidth />
              <Input
                label="Tags"
                placeholder="saas, consulting (comma-separated)"
                fullWidth
              />
              <Input
                label="Sort Order"
                type="number"
                placeholder="0"
                fullWidth
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" defaultChecked />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" />
                Featured
              </label>

              <div className="flex gap-3 pt-2">
                <Button type="submit">Create</Button>
                <Link to="/businesses">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
