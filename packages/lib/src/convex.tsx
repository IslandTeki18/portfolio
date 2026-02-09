import { ReactNode } from "react";
import {
  ConvexProvider,
  ConvexReactClient,
  useQuery,
  useMutation,
  useAction,
  useConvex,
} from "convex/react";

export { useQuery, useMutation, useAction, useConvex, ConvexReactClient };

interface ConvexClientProviderProps {
  client: ConvexReactClient;
  children: ReactNode;
}

export function ConvexClientProvider({
  client,
  children,
}: ConvexClientProviderProps) {
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
