import { env } from "../data/env.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./schema.ts";

export const db = drizzle({
  connection: {
    host: env.POSTGRES_HOST,
    password: env.POSTGRES_PASSWORD,
    user: env.POSTGRES_USER,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_NAME,
    ssl: false,
  },
  relations,
});
