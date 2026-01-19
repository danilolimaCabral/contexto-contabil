import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "staff"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Staff members (employees) of the accounting firm
 */
export const staffMembers = mysqlTable("staff_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Link to users table when they login
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  department: mysqlEnum("department", ["fiscal", "contabil", "pessoal", "paralegal"]).notNull(),
  position: varchar("position", { length: 255 }),
  isActive: boolean("isActive").default(true),
  isOnline: boolean("isOnline").default(false),
  lastSeen: timestamp("lastSeen"),
  avatarColor: varchar("avatarColor", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StaffMember = typeof staffMembers.$inferSelect;
export type InsertStaffMember = typeof staffMembers.$inferInsert;

/**
 * Leads captured from chatbot or contact form
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  message: text("message"),
  source: mysqlEnum("source", ["chatbot", "contact_form", "whatsapp"]).default("contact_form").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "lost"]).default("new").notNull(),
  assignedToId: int("assignedToId"), // Staff member assigned to this lead
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Appointments scheduled via chatbot or website
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  staffMemberId: int("staffMemberId"), // Staff member assigned to this appointment
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  scheduledDate: timestamp("scheduledDate").notNull(),
  duration: int("duration").default(30).notNull(), // in minutes
  subject: varchar("subject", { length: 255 }),
  serviceType: mysqlEnum("serviceType", ["contabilidade", "tributaria", "pessoal", "fiscal", "abertura", "administrativo"]),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Chat messages history for AI chatbot
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Testimonials/Cases de sucesso
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  content: text("content").notNull(),
  rating: int("rating").default(5),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Clientes cadastrados no portal
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Link to users table when they login
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  cnpj: varchar("cnpj", { length: 20 }),
  cpf: varchar("cpf", { length: 14 }),
  address: text("address"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Serviços contratados pelos clientes
 */
export const clientServices = mysqlTable("client_services", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  serviceType: mysqlEnum("serviceType", ["contabilidade", "tributaria", "pessoal", "fiscal", "abertura", "administrativo"]).notNull(),
  serviceName: varchar("serviceName", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in_progress", "awaiting_docs", "review", "completed", "cancelled"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  assignedToId: int("assignedToId"), // Staff member assigned
  startDate: timestamp("startDate"),
  dueDate: timestamp("dueDate"),
  completedDate: timestamp("completedDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientService = typeof clientServices.$inferSelect;
export type InsertClientService = typeof clientServices.$inferInsert;

/**
 * Histórico de atualizações dos serviços
 */
export const serviceUpdates = mysqlTable("service_updates", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  message: text("message").notNull(),
  updatedById: int("updatedById"), // Staff member who made the update
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServiceUpdate = typeof serviceUpdates.$inferSelect;
export type InsertServiceUpdate = typeof serviceUpdates.$inferInsert;

/**
 * Documentos enviados pelos clientes
 */
export const clientDocuments = mysqlTable("client_documents", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  serviceId: int("serviceId"), // Optional link to a specific service
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["fiscal", "contabil", "pessoal", "societario", "outros"]).default("outros").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 key
  fileUrl: varchar("fileUrl", { length: 1000 }).notNull(), // S3 URL
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"), // in bytes
  uploadedById: int("uploadedById"), // User who uploaded
  isProcessed: boolean("isProcessed").default(false),
  processedById: int("processedById"), // Staff member who processed
  processedAt: timestamp("processedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientDocument = typeof clientDocuments.$inferSelect;
export type InsertClientDocument = typeof clientDocuments.$inferInsert;

/**
 * Solicitações de serviços feitas pelos clientes
 */
export const serviceRequests = mysqlTable("service_requests", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  serviceType: mysqlEnum("serviceType", ["contabilidade", "fiscal", "pessoal", "abertura_empresa", "alteracao_contratual", "certidoes", "consultoria", "outros"]).notNull(),
  description: text("description"),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),
  status: mysqlEnum("status", ["pending", "in_review", "approved", "converted", "rejected"]).default("pending").notNull(),
  reviewedById: int("reviewedById"), // Staff member who reviewed
  reviewedAt: timestamp("reviewedAt"),
  convertedToServiceId: int("convertedToServiceId"), // If converted to a client service
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = typeof serviceRequests.$inferInsert;

/**
 * Notícias fiscais e contábeis
 */
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  summary: text("summary"),
  content: text("content"),
  category: mysqlEnum("category", ["fiscal", "contabil", "tributario", "trabalhista", "previdenciario", "economia", "reforma_tributaria"]).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 1000 }),
  imageUrl: varchar("imageUrl", { length: 1000 }),
  author: varchar("author", { length: 255 }),
  publishedAt: timestamp("publishedAt").notNull(),
  isFeatured: boolean("isFeatured").default(false),
  isActive: boolean("isActive").default(true),
  viewCount: int("viewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;
