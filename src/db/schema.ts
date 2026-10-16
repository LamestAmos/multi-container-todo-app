import { defineRelations } from "drizzle-orm";
import { boolean, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const TodoTable = pgTable("todos", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  content: text().notNull(),
  completed: boolean().default(false),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const relations = defineRelations({ TodoTable });
