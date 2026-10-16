import { TodoTable } from "../../db/schema.ts";
import { db } from "../../db/index.ts";
import { eq } from "drizzle-orm";

export const TodoService = {
  $get(id: string) {
    return db.query.TodoTable.findFirst({ where: { id } });
  },
  $getAll() {
    return db.query.TodoTable.findMany();
  },
  $create(title: string, content: string) {
    return db.insert(TodoTable).values({ title, content }).returning();
  },
  $update(id: string, title: string, content: string) {
    return db.update(TodoTable).set({ title, content }).where(eq(TodoTable.id, id)).returning();
  },
  $delete(id: string) {
    return db.delete(TodoTable).where(eq(TodoTable.id, id)).returning();
  },
  $toggle(id: string, force?: boolean) {
    return db.update(TodoTable).set({ completed: force }).where(eq(TodoTable.id, id)).returning();
  },
};
