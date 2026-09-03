import { SignOutButton } from "@clerk/clerk-react";
import { Button } from "@repo/ui/button";

export default function NotAuthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background-primary p-8">
      <h1 className="m-0 font-mono text-5xl font-medium text-label-secondary">
        403
      </h1>
      <p className="m-0 text-base text-muted-foreground">Not authorized.</p>
      <SignOutButton>
        <Button variant="primary" size="sm" className="rounded-md">
          Sign out
        </Button>
      </SignOutButton>
    </div>
  );
}
