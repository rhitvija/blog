import { integer, pgTable, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }),
}, (table) => [unique("users_email_key").on(table.email)]);

export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  desc: varchar({ length: 255 }).notNull(),
  content: text(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const blogs = pgTable("blogs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  blogTitle: varchar("blog_title", { length: 255 }).notNull(),
  blogDesc: varchar("blog_desc", { length: 255 }).notNull(),
});
