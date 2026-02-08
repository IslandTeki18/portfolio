import { ReactNode } from "react";
import {
  ConvexProvider,
  ConvexReactClient,
  useQuery,
  useMutation,
  useConvex,
} from "convex/react";

export { useQuery, useMutation, useConvex, ConvexReactClient };

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
