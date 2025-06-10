import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'admin' or 'user'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  registrar: text("registrar"),
  expiryDate: timestamp("expiry_date"),
  status: text("status").notNull().default("active"), // 'active', 'expiring', 'expired'
  tags: jsonb("tags").$type<string[]>().default([]),
  autoRenew: boolean("auto_renew").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  domainId: integer("domain_id").references(() => domains.id).notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("USD"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  domainId: integer("domain_id").references(() => domains.id),
  type: text("type").notNull(), // 'expiry_reminder', 'payment_success', 'domain_expired'
  message: text("message").notNull(),
  emailSent: boolean("email_sent").default(false),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export const insertDomainSchema = createInsertSchema(domains).pick({
  userId: true,
  name: true,
  registrar: true,
  expiryDate: true,
  tags: true,
  autoRenew: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  domainId: true,
  amount: true,
  currency: true,
  razorpayPaymentId: true,
  razorpayOrderId: true,
  status: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  domainId: true,
  type: true,
  message: true,
});

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Domain = typeof domains.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

export type DomainWithStats = Domain & {
  daysUntilExpiry: number;
  progressPercentage: number;
};

export type DashboardStats = {
  totalDomains: number;
  activeDomains: number;
  expiringSoon: number;
  expiredDomains: number;
};
