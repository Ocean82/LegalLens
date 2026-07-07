import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const jurisdictionEnum = pgEnum("jurisdiction", [
  "federal",
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
  "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
  "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana",
  "maine", "maryland", "massachusetts", "michigan", "minnesota",
  "mississippi", "missouri", "montana", "nebraska", "nevada",
  "new_hampshire", "new_jersey", "new_mexico", "new_york",
  "north_carolina", "north_dakota", "ohio", "oklahoma", "oregon",
  "pennsylvania", "rhode_island", "south_carolina", "south_dakota",
  "tennessee", "texas", "utah", "vermont", "virginia", "washington",
  "west_virginia", "wisconsin", "wyoming", "district_of_columbia",
]);

export const categoryEnum = pgEnum("category", [
  "criminal",
  "civil",
  "family",
  "employment",
  "immigration",
  "intellectual_property",
  "tax",
  "real_estate",
  "bankruptcy",
  "environmental",
  "constitutional",
  "corporate",
  "other",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const searches = pgTable("searches", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  query: text("query").notNull(),
  jurisdiction: jurisdictionEnum("jurisdiction").notNull(),
  category: categoryEnum("category"),
  resultsCount: integer("results_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const legalResults = pgTable("legal_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  searchId: uuid("search_id").references(() => searches.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  sourceUrl: text("source_url"),
  sourceName: varchar("source_name", { length: 255 }),
  jurisdiction: jurisdictionEnum("jurisdiction").notNull(),
  category: categoryEnum("category"),
  caseNumber: varchar("case_number", { length: 255 }),
  dateFiled: varchar("date_filed", { length: 100 }),
  court: varchar("court", { length: 500 }),
  status: varchar("status", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedResults = pgTable("saved_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  resultId: uuid("result_id").references(() => legalResults.id, { onDelete: "cascade" }).notNull(),
  notes: text("notes"),
  folder: varchar("folder", { length: 255 }).default("General"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const researchNotes = pgTable("research_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  jurisdiction: jurisdictionEnum("jurisdiction"),
  category: categoryEnum("category"),
  pinned: boolean("pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
