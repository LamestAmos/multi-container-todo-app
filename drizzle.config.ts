import { defineConfig } from "drizzle-kit";
import { env } from "./src/data/env.ts";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: env.POSTGRES_HOST,
    password: env.POSTGRES_PASSWORD,
    user: env.POSTGRES_USER,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_NAME,
    ssl: false,
  },
});
