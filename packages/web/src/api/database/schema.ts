import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export * from "./auth-schema";

// User progress: per-problem solved/bookmarked state synced to DB
export const userProgress = sqliteTable("user_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  problemId: text("problem_id").notNull(),
  solved: integer("solved", { mode: "boolean" }).default(false).notNull(),
  bookmarked: integer("bookmarked", { mode: "boolean" }).default(false).notNull(),
  hintsViewed: integer("hints_viewed").default(0).notNull(),
  solvedAt: integer("solved_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});
