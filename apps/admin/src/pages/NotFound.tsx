import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <h1 className="m-0 font-mono text-5xl font-medium text-label-secondary">
        404
      </h1>
      <p className="m-0 text-base text-muted-foreground">Page not found.</p>
      <Link to="/">
        <Button variant="primary" size="sm" className="rounded-md">
          Back to dashboard
        </Button>
      </Link>
    </div>
  );
}
