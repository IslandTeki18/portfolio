import { z } from "zod";
import { createEnvValidator, commonEnvSchema } from "@repo/lib/env";

const envSchema = z.object({
  ...commonEnvSchema,
  VITE_PUBLIC_URL: z
    .string()
    .url()
    .optional()
    .describe("Public URL for the portfolio site"),
  MODE: z.enum(["development", "production", "test"]),
  DEV: z.boolean(),
  PROD: z.boolean(),
});

export const env = createEnvValidator(envSchema);
export type Env = z.infer<typeof envSchema>;
