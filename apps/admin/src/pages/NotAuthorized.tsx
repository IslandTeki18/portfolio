import { SignOutButton } from "@clerk/clerk-react";
import { Button } from "@repo/ui/button";

export default function NotAuthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-primary p-8">
      <h1 className="text-5xl font-bold text-label-primary">403</h1>
      <p className="mt-2 text-label-secondary">Not authorized.</p>
      <SignOutButton>
        <Button variant="primary" className="mt-6">
          Sign Out
        </Button>
      </SignOutButton>
    </div>
  );
}
