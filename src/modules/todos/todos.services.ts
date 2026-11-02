import { TodoTable } from "../../db/schema.ts";
import { db } from "../../db/index.ts";
import { eq } from "drizzle-orm";
import redisClient from "../../db/redis.ts";

type Todo = {
  id: string;
  title: string;
  content: string;
  completed: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export const TodoService = {
  async $get(id: string): Promise<Todo | undefined> {
    const cache = await redisClient.get(`todos:${id}`);
    if (cache) {
      return JSON.parse(cache);
    }
    return db.query.TodoTable.findFirst({ where: { id } });
  },

  async $getAll(): Promise<Todo[]> {
    const cache = await redisClient.get("todos");
    if (cache && this.getAllCacheValid) {
      return JSON.parse(cache);
    }
    const todos = await db.query.TodoTable.findMany();
    redisClient.set("todos", JSON.stringify(todos));
    this.getAllCacheValid = true;
    return todos;
  },

  async $create(title: string, content: string) {
    this.getAllCacheValid = false;
    const [todo] = await db.insert(TodoTable).values({ title, content }).returning();
    await this.setCache(todo.id, todo);
    return todo;
  },

  async $update(id: string, title: string, content: string) {
    const [todo] = await db
      .update(TodoTable)
      .set({ title, content })
      .where(eq(TodoTable.id, id))
      .returning();
    if (!todo) return;
    this.getAllCacheValid = false;
    await this.setCache(id, todo);
    return todo;
  },

  async $delete(id: string) {
    const [todo] = await db.delete(TodoTable).where(eq(TodoTable.id, id)).returning();
    if (!todo) return;
    this.getAllCacheValid = false;
    await this.setCache(id, todo);
    return todo;
  },

  async $toggle(id: string, force?: boolean) {
    const [todo] = await db
      .update(TodoTable)
      .set({ completed: force })
      .where(eq(TodoTable.id, id))
      .returning();
    if (!todo) return;
    this.getAllCacheValid = false;
    await this.setCache(id, todo);
    return todo;
  },

  setCache(id: string, todo: Todo) {
    return redisClient.set(`todos:${id}`, JSON.stringify(todo));
  },
  getAllCacheValid: true,
};
