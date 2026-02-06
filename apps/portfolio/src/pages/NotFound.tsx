import { Link } from "react-router-dom";
import { Button } from "@repo/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-primary p-8">
      <h1 className="text-5xl font-bold text-label-primary">404</h1>
      <p className="mt-2 text-label-secondary">Page not found.</p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  );
}
