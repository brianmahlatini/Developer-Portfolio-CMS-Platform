import { z } from "zod";

/**
 * Environment validation schema
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),

  // Auth
  JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // Admin
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),

  // Node
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Feature flags
  ENABLE_ANALYTICS: z
    .string()
    .default("true")
    .transform((v) => v === "true"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 */
export function validateEnv(): Env {
  const env = process.env as Record<string, string | undefined>;

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(`Invalid environment variables:\n${issues}`);
    }
    throw error;
  }
}

/**
 * Cached validated environment
 */
let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}
