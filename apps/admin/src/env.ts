import { z } from "zod";
import { createEnvValidator, commonEnvSchema } from "@repo/lib/env";

const envSchema = z.object({
  ...commonEnvSchema,
  VITE_CLERK_PUBLISHABLE_KEY: z
    .string()
    .startsWith("pk_")
    .describe("Clerk publishable key"),
  MODE: z.enum(["development", "production", "test"]),
  DEV: z.boolean(),
  PROD: z.boolean(),
});

export const env = createEnvValidator(envSchema);
export type Env = z.infer<typeof envSchema>;
