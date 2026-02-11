import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Spinner } from "@repo/ui/spinner";

const navLinks = [
  { to: "/projects", label: "Projects" },
  { to: "/resume", label: "Resume" },
  { to: "/businesses", label: "Businesses" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-label-primary">
            Admin Dashboard
          </h1>
          <p className="text-label-secondary">
            Manage your portfolio content.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Card>
                <CardContent>
                  <p className="text-center font-medium text-label-primary">
                    {link.label}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
