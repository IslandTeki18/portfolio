import { z } from "zod";
import { createEnvValidator, commonEnvSchema } from "@repo/lib/env";

const envSchema = z.object({
  ...commonEnvSchema,
  VITE_AUTH_DOMAIN: z.string().describe("Auth provider domain"),
  VITE_AUTH_CLIENT_ID: z.string().describe("Auth provider client ID"),
  MODE: z.enum(["development", "production", "test"]),
  DEV: z.boolean(),
  PROD: z.boolean(),
});

export const env = createEnvValidator(envSchema);
export type Env = z.infer<typeof envSchema>;
