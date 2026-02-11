import { useQuery } from "convex/react";
import type { FunctionReference } from "convex/server";

/**
 * Resolve a single Convex storage ID to a URL.
 * Returns undefined while loading, null if the file doesn't exist.
 */
export function useStorageUrl(
  getFileUrl: FunctionReference<"query", "public", { storageId: string }, string | null>,
  storageId: string | undefined,
): string | null | undefined {
  return useQuery(
    getFileUrl,
    storageId ? { storageId } : "skip",
  );
}

/**
 * Batch resolve multiple storage IDs to URLs.
 * Returns undefined while loading, or an array of { storageId, url } objects.
 */
export function useStorageUrls(
  getFileUrls: FunctionReference<
    "query",
    "public",
    { storageIds: string[] },
    Array<{ storageId: string; url: string | null }>
  >,
  storageIds: string[] | undefined,
): Array<{ storageId: string; url: string | null }> | undefined {
  return useQuery(
    getFileUrls,
    storageIds && storageIds.length > 0 ? { storageIds } : "skip",
  );
}
