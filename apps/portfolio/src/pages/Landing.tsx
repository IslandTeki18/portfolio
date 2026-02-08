import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";

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
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-label-secondary">
              Resume content will be loaded here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-label-secondary">
              Businesses will be listed here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input label="Name" placeholder="Your name" fullWidth />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                fullWidth
              />
              <Textarea
                label="Message"
                placeholder="Your message..."
                rows={4}
                required
                fullWidth
              />
              <Button type="submit">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
