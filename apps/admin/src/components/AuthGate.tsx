import { ReactNode, useEffect, useRef } from "react";
import { useUser, SignIn } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@backend/_generated/api";
import { Spinner } from "@repo/ui/spinner";
import NotAuthorized from "../pages/NotAuthorized";

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { isLoaded, isSignedIn } = useUser();
  const role = useQuery(api.users.getMyRole);
  const upsertMe = useMutation(api.users.upsertMe);
  const hasUpserted = useRef(false);

  useEffect(() => {
    if (isSignedIn && !hasUpserted.current) {
      hasUpserted.current = true;
      upsertMe();
    }
  }, [isSignedIn, upsertMe]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <SignIn routing="hash" />
      </div>
    );
  }

  if (role === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (role !== "admin") {
    return <NotAuthorized />;
  }

  return <>{children}</>;
}
