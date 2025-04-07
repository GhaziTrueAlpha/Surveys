import { pgTable, text, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CLIENT: 'client'
} as const;

// Survey categories
export const SURVEY_CATEGORIES = [
  'Automobile',
  'Food & Beverage',
  'Ethnicity',
  'Business & Occupation',
  'Healthcare Consumer',
  'Healthcare Professional',
  'Mobile',
  'Smoking',
  'Household',
  'Education',
  'Electronic',
  'Gaming',
  'Mother & Baby',
  'Media',
  'Travel',
  'Hobbies & Interests',
] as const;

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  unique_id: text("unique_id"), // Unique ID for clients/vendors (e.g., 1112)
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  flag: text("flag").default('no'),
  category: text("category"),
  name: text("name").notNull(),
  website: text("website"),
  company_name: text("company_name").notNull(),
  account_email: text("account_email").notNull(),
  contact_number: text("contact_number"),
  hsn_sac: text("hsn_sac"),
  gst: text("gst").notNull(),
  country: text("country"),
  region: text("region"),
  city: text("city").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Surveys Table
export const surveys = pgTable("surveys", {
  id: uuid("id").defaultRandom().primaryKey(),
  unique_id: text("unique_id"), // Unique ID for surveys (e.g., 1112A)
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  reward_amount: text("reward_amount"),
  estimated_time: text("estimated_time"),
  created_by: uuid("created_by").references(() => users.id),
  client_id: uuid("client_id").references(() => users.id),
  loi: text("loi"), // Length of interview
  sample_size: text("sample_size"), // Sample size/People size/N/SS
  ir: text("ir"), // Incidence rate
  market: text("market"), // Market/Geo/Country
  target_audience: text("target_audience"), // Target audience
  project_type: text("project_type"), // Project type/category
  cpi: text("cpi"), // CPI/Budget
  client_currency: text("client_currency"), // Client currency for payment
  survey_link: text("survey_link"), // Main survey link
  main_market_link: text("main_market_link"), // Main market link (unique per survey)
  security_redirect: text("security_redirect"), // Security redirect link
  quota_redirect: text("quota_redirect"), // Quota redirect link
  completion_redirect: text("completion_redirect"), // Completion redirect link
  termination_redirect: text("termination_redirect"), // Termination redirect link
  created_at: timestamp("created_at").defaultNow(),
  is_active: boolean("is_active").default(true),
});

// Survey Responses Table
export const surveyResponses = pgTable("survey_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  survey_id: uuid("survey_id").references(() => surveys.id),
  vendor_id: uuid("vendor_id").references(() => users.id),
  completed_at: timestamp("completed_at").defaultNow(),
  reward_earned: text("reward_earned"),
});

// Define relations after all tables are defined
export const usersRelations = relations(users, ({ many }) => ({
  surveys: many(surveys),
  surveyResponses: many(surveyResponses),
}));

export const surveysRelations = relations(surveys, ({ one, many }) => ({
  creator: one(users, {
    fields: [surveys.created_by],
    references: [users.id],
  }),
  client: one(users, {
    fields: [surveys.client_id],
    references: [users.id],
  }),
  responses: many(surveyResponses),
}));

export const surveyResponsesRelations = relations(surveyResponses, ({ one }) => ({
  survey: one(surveys, {
    fields: [surveyResponses.survey_id],
    references: [surveys.id],
  }),
  vendor: one(users, {
    fields: [surveyResponses.vendor_id],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.VENDOR, USER_ROLES.CLIENT]),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  company_name: z.string().min(1),
  account_email: z.string().email(),
  gst: z.string().min(1),
  city: z.string().min(1),
}).omit({ id: true, created_at: true });

export const insertSurveySchema = createInsertSchema(surveys, {
  category: z.enum(SURVEY_CATEGORIES),
  title: z.string().min(1),
  description: z.string().optional(),
  client_id: z.string().uuid(),
  loi: z.string().optional(),
  sample_size: z.string().optional(),
  ir: z.string().optional(),
  market: z.string().optional(),
  target_audience: z.string().optional(),
  project_type: z.string().optional(),
  cpi: z.string().optional(),
  client_currency: z.string().optional(),
  survey_link: z.string().url(),
  security_redirect: z.string().url().optional(),
  quota_redirect: z.string().url().optional(),
  completion_redirect: z.string().url().optional(),
  termination_redirect: z.string().url().optional()
}).omit({ id: true, created_at: true });

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({ id: true, completed_at: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type UserRole = keyof typeof USER_ROLES;
export type SurveyCategory = typeof SURVEY_CATEGORIES[number];
