import { config } from "dotenv";
import z from "zod";

config({ quiet: true });

const EnvSchema = z.object({
  // POSTGRES
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_NAME: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(8),
  POSTGRES_USER: z.string().min(1),

  // REDIS
  REDIS_PORT: z.coerce.number().default(6379),

  // MISC
  PORT: z.coerce.number().default(3000),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid Env: ${z.prettifyError(parsedEnv.error)}`);
}

export const env = parsedEnv.data;
