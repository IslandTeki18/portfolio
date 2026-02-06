import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Spinner } from "@repo/ui/spinner";

const projects = [
  { slug: "project-alpha", title: "Project Alpha" },
  { slug: "project-beta", title: "Project Beta" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-label-primary">Portfolio</h1>
          <p className="text-label-secondary">
            Welcome to my portfolio. Built with React, TypeScript, and Tailwind
            CSS v4.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link to={`/projects/${p.slug}`}>
                    <Button variant="outline" className="w-full justify-start">
                      {p.title}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UI Kit Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Spinner size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
