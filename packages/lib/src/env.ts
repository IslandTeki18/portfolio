import { z } from "zod";

/**
 * Validates environment variables against a Zod schema.
 * Throws on validation failure with detailed error messages.
 */
export function createEnvValidator<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.infer<z.ZodObject<T>> {
  const result = schema.safeParse(import.meta.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    throw new Error(
      "Invalid environment variables. Check console for details."
    );
  }

  return result.data;
}

/**
 * Common environment variable schemas for reuse across apps
 */
export const commonEnvSchema = {
  VITE_CONVEX_URL: z
    .string()
    .url("VITE_CONVEX_URL must be a valid URL")
    .describe("Convex deployment URL"),
};
