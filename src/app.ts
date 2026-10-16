import { Hono } from "hono";
import todoRoutes from "./modules/todos/todos.ts";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());

app.get("/", (ctx) => {
  return ctx.text("Todo API is running!");
});

app.get("/health", (ctx) => {
  return ctx.json({ ok: true });
});

app.route("/todos", todoRoutes);

export default app;
