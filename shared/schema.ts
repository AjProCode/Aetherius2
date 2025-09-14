import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const families = pgTable("families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  totalBalance: decimal("total_balance", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  name: text("name").notNull(),
  role: text("role").notNull(), // "Family Head", "Co-Manager", "Student", "Junior Saver"
  age: integer("age"),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0"),
  avatar: text("avatar"),
  status: text("status"), // "Top Saver", "Learning", "Saving Goal", etc.
  isActive: boolean("is_active").default(true),
});

export const familyGoals = pgTable("family_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  name: text("name").notNull(),
  description: text("description"),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 12, scale: 2 }).default("0"),
  deadline: timestamp("deadline"),
  category: text("category"), // "vacation", "emergency", "education", etc.
  icon: text("icon"),
  contributors: jsonb("contributors").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  month: text("month").notNull(), // "2024-11"
  totalBudget: decimal("total_budget", { precision: 12, scale: 2 }).notNull(),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default("0"),
  categories: jsonb("categories").$type<{
    food: { budget: number; spent: number };
    transport: { budget: number; spent: number };
    entertainment: { budget: number; spent: number };
    shopping: { budget: number; spent: number };
    utilities: { budget: number; spent: number };
    healthcare: { budget: number; spent: number };
  }>(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  memberId: varchar("member_id").references(() => familyMembers.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  category: text("category").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "income", "expense", "saving", "investment"
  date: timestamp("date").defaultNow(),
});

export const smartAlerts = pgTable("smart_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  type: text("type").notNull(), // "overspending", "scam", "achievement", "goal_progress"
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(), // "low", "medium", "high"
  isRead: boolean("is_read").default(false),
  data: jsonb("data"), // Additional context data
  createdAt: timestamp("created_at").defaultNow(),
});

export const educationalContent = pgTable("educational_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  type: text("type").notNull(), // "lesson", "game", "quiz"
  category: text("category"), // "investing", "budgeting", "saving", etc.
  ageGroup: text("age_group"), // "children", "teens", "adults", "all"
  duration: integer("duration"), // in minutes
  difficulty: text("difficulty"), // "beginner", "intermediate", "advanced"
  icon: text("icon"),
  isAIGenerated: boolean("is_ai_generated").default(false),
});

export const learningProgress = pgTable("learning_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => familyMembers.id),
  contentId: varchar("content_id").notNull().references(() => educationalContent.id),
  progress: integer("progress").default(0), // 0-100
  completed: boolean("completed").default(false),
  lastAccessed: timestamp("last_accessed").defaultNow(),
});

export const investments = pgTable("investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // "sip", "fd", "gold", "stocks"
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  returns: decimal("returns", { precision: 5, scale: 2 }), // percentage
  risk: text("risk"), // "low", "medium", "high"
  description: text("description"),
  minInvestment: decimal("min_investment", { precision: 12, scale: 2 }),
});

export const financialServices = pgTable("financial_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  type: text("type").notNull(), // "insurance", "loan", "credit_score"
  name: text("name").notNull(),
  status: text("status"), // "active", "pending", "completed"
  amount: decimal("amount", { precision: 12, scale: 2 }),
  monthlyPayment: decimal("monthly_payment", { precision: 12, scale: 2 }),
  details: jsonb("details"), // Additional service-specific data
});

// Insert schemas
export const insertFamilySchema = createInsertSchema(families).omit({
  id: true,
  createdAt: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
});

export const insertFamilyGoalSchema = createInsertSchema(familyGoals).omit({
  id: true,
  createdAt: true,
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  date: true,
});

export const insertSmartAlertSchema = createInsertSchema(smartAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertEducationalContentSchema = createInsertSchema(educationalContent).omit({
  id: true,
});

export const insertLearningProgressSchema = createInsertSchema(learningProgress).omit({
  id: true,
  lastAccessed: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
});

export const insertFinancialServiceSchema = createInsertSchema(financialServices).omit({
  id: true,
});

// Types
export type Family = typeof families.$inferSelect;
export type InsertFamily = z.infer<typeof insertFamilySchema>;

export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;

export type FamilyGoal = typeof familyGoals.$inferSelect;
export type InsertFamilyGoal = z.infer<typeof insertFamilyGoalSchema>;

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type SmartAlert = typeof smartAlerts.$inferSelect;
export type InsertSmartAlert = z.infer<typeof insertSmartAlertSchema>;

export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;

export type LearningProgress = typeof learningProgress.$inferSelect;
export type InsertLearningProgress = z.infer<typeof insertLearningProgressSchema>;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;

export type FinancialService = typeof financialServices.$inferSelect;
export type InsertFinancialService = z.infer<typeof insertFinancialServiceSchema>;
