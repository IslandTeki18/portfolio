import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import type { FunctionReference } from "convex/server";

/**
 * Hook encapsulating the 3-step Convex file upload flow:
 * 1. Generate upload URL via mutation
 * 2. POST file to the URL
 * 3. Extract and return the storageId
 */
export function useUpload(
  generateUploadUrl: FunctionReference<"mutation", "public", Record<string, never>, string>,
) {
  const generateUrl = useMutation(generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      setError(null);
      try {
        const url = await generateUrl();
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Upload failed: ${result.statusText}`);
        }

        const { storageId } = await result.json();
        return storageId as string;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [generateUrl],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsUploading(false);
  }, []);

  return { upload, isUploading, error, reset };
}
