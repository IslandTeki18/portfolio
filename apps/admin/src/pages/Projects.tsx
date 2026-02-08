import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";

export default function Projects() {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/">
          <Button variant="ghost">&larr; Dashboard</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="Search" placeholder="Filter projects..." fullWidth />
              <Link to="/projects/new">
                <Button variant="primary">Create Project</Button>
              </Link>
              <p className="text-label-secondary">No projects yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
