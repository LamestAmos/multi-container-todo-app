import { Hono } from "hono";
import { sValidator } from "@hono/standard-validator";
import z from "zod";
import { TodoService } from "./todos.services.ts";

const app = new Hono();

const createTodoSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const getTodoSchema = z.object({
  id: z.uuid(),
});

app.get("/", async (ctx) => {
  const todos = await TodoService.$getAll();

  return ctx.json({ todos });
});

app.get("/:id", sValidator("param", getTodoSchema), async (ctx) => {
  const { id } = ctx.req.valid("param");
  const todo = await TodoService.$get(id);

  if (todo == null) {
    return ctx.json({ message: "Todo Not Found" }, 404);
  }

  return ctx.json({ todo });
});

app.post("/", sValidator("json", createTodoSchema), async (ctx) => {
  const { title, content } = ctx.req.valid("json");

  const [todo] = await TodoService.$create(title, content);

  return ctx.json({ todo }, 201);
});

app.post(
  "/:id/toggle",
  sValidator("param", getTodoSchema),
  sValidator("json", z.object({ force: z.coerce.boolean().optional().default(true) })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const { force } = ctx.req.valid("json");
    const [todo] = await TodoService.$toggle(id, force);

    if (todo == null) {
      return ctx.json({ message: "Todo Not Found" }, 404);
    }

    return ctx.json({ todo });
  },
);

app.put(
  "/:id",
  sValidator("json", createTodoSchema),
  sValidator("param", getTodoSchema),
  async (ctx) => {
    const { id } = ctx.req.valid("param");

    const { title, content } = ctx.req.valid("json");

    const [todo] = await TodoService.$update(id, title, content);

    if (todo == null) {
      return ctx.json({ message: "Todo Not Found" }, 404);
    }

    return ctx.json({ todo });
  },
);

app.delete("/:id", sValidator("param", getTodoSchema), async (ctx) => {
  const { id } = ctx.req.valid("param");

  const [todo] = await TodoService.$delete(id);

  if (todo == null) {
    return ctx.json({ message: "Todo Not Found" }, 404);
  }

  return ctx.body(null, 204);
});

export default app;
