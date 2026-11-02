import { env } from "../data/env.ts";
import { createClient } from "redis";

const client = createClient({
  url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
});

client.on("error", (err) => console.error("Redis Client Error", err));

await client.connect();

export default client;
