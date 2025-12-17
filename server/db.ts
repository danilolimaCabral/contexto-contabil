import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, Lead, appointments, InsertAppointment, Appointment, chatMessages, InsertChatMessage, ChatMessage, testimonials, Testimonial, staffMembers, StaffMember, InsertStaffMember, clients, Client, InsertClient, clientServices, ClientService, InsertClientService, serviceUpdates, ServiceUpdate, InsertServiceUpdate, clientDocuments, ClientDocument, InsertClientDocument, serviceRequests, ServiceRequest, InsertServiceRequest } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER FUNCTIONS ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== STAFF MEMBER FUNCTIONS ====================

export async function createStaffMember(staff: InsertStaffMember): Promise<StaffMember | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(staffMembers).values(staff);
    const insertId = result[0].insertId;
    const newStaff = await db.select().from(staffMembers).where(eq(staffMembers.id, insertId)).limit(1);
    return newStaff[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create staff member:", error);
    throw error;
  }
}

export async function getStaffMembers(): Promise<StaffMember[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(staffMembers).where(eq(staffMembers.isActive, true)).orderBy(staffMembers.department);
}

export async function getStaffByDepartment(department: StaffMember["department"]): Promise<StaffMember[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(staffMembers).where(
    and(eq(staffMembers.department, department), eq(staffMembers.isActive, true))
  );
}

export async function getStaffById(id: number): Promise<StaffMember | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(staffMembers).where(eq(staffMembers.id, id)).limit(1);
  return result[0] || null;
}

export async function linkUserToStaff(userId: number, staffId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(staffMembers).set({ userId }).where(eq(staffMembers.id, staffId));
}

export async function updateStaffOnlineStatus(staffId: number, isOnline: boolean): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(staffMembers).set({ 
    isOnline, 
    lastSeen: new Date() 
  }).where(eq(staffMembers.id, staffId));
}

export async function getOnlineStaff(): Promise<StaffMember[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(staffMembers).where(
    and(eq(staffMembers.isActive, true), eq(staffMembers.isOnline, true))
  );
}

export async function getAllStaffMembers(): Promise<StaffMember[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(staffMembers).orderBy(staffMembers.department);
}

export async function updateStaffMember(id: number, data: Partial<InsertStaffMember>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(staffMembers).set(data).where(eq(staffMembers.id, id));
}

export async function deactivateStaffMember(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(staffMembers).set({ isActive: false }).where(eq(staffMembers.id, id));
}

export async function reactivateStaffMember(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(staffMembers).set({ isActive: true }).where(eq(staffMembers.id, id));
}

// ==================== LEAD FUNCTIONS ====================

export async function createLead(lead: InsertLead): Promise<Lead | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create lead: database not available");
    return null;
  }

  try {
    const result = await db.insert(leads).values(lead);
    const insertId = result[0].insertId;
    const newLead = await db.select().from(leads).where(eq(leads.id, insertId)).limit(1);
    return newLead[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create lead:", error);
    throw error;
  }
}

export async function getLeads(): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getLeadsByStaff(staffId: number): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(leads).where(eq(leads.assignedToId, staffId)).orderBy(desc(leads.createdAt));
}

export async function updateLeadStatus(id: number, status: Lead["status"]): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(leads).set({ status }).where(eq(leads.id, id));
}

export async function assignLeadToStaff(leadId: number, staffId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(leads).set({ assignedToId: staffId }).where(eq(leads.id, leadId));
}

// ==================== APPOINTMENT FUNCTIONS ====================

export async function createAppointment(appointment: InsertAppointment): Promise<Appointment | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create appointment: database not available");
    return null;
  }

  try {
    const result = await db.insert(appointments).values(appointment);
    const insertId = result[0].insertId;
    const newAppointment = await db.select().from(appointments).where(eq(appointments.id, insertId)).limit(1);
    return newAppointment[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create appointment:", error);
    throw error;
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(appointments).orderBy(desc(appointments.scheduledDate));
}

export async function getAppointmentsByStaff(staffId: number): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(appointments).where(eq(appointments.staffMemberId, staffId)).orderBy(desc(appointments.scheduledDate));
}

export async function updateAppointmentStatus(id: number, status: Appointment["status"]): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(appointments).set({ status }).where(eq(appointments.id, id));
}

export async function assignAppointmentToStaff(appointmentId: number, staffId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(appointments).set({ staffMemberId: staffId }).where(eq(appointments.id, appointmentId));
}

// ==================== CHAT MESSAGE FUNCTIONS ====================

export async function saveChatMessage(message: InsertChatMessage): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(chatMessages).values(message);
}

export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(chatMessages.createdAt);
}

// ==================== TESTIMONIAL FUNCTIONS ====================

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(desc(testimonials.createdAt));
}

export async function createTestimonial(testimonial: Omit<Testimonial, "id" | "createdAt">): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(testimonials).values(testimonial);
}

// ==================== SEED STAFF MEMBERS ====================

export async function seedStaffMembers(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existingStaff = await getStaffMembers();
  if (existingStaff.length > 0) return; // Already seeded

  const staffData: InsertStaffMember[] = [
    { name: "Gabriel", department: "fiscal", position: "Analista Fiscal", avatarColor: "from-amber-500 to-amber-700" },
    { name: "Samarah", department: "fiscal", position: "Analista Fiscal", avatarColor: "from-amber-500 to-amber-700" },
    { name: "Laura", department: "contabil", position: "Analista Contábil", avatarColor: "from-emerald-500 to-emerald-700" },
    { name: "Janderley", department: "pessoal", position: "Analista de DP", avatarColor: "from-blue-500 to-blue-700" },
    { name: "Emily", department: "pessoal", position: "Analista de DP", avatarColor: "from-blue-500 to-blue-700" },
    { name: "Júnior", department: "pessoal", position: "Analista de DP", avatarColor: "from-blue-500 to-blue-700" },
    { name: "José", department: "paralegal", position: "Analista Paralegal", avatarColor: "from-purple-500 to-purple-700" },
    { name: "Bruna", department: "paralegal", position: "Analista Paralegal", avatarColor: "from-purple-500 to-purple-700" },
  ];

  for (const staff of staffData) {
    await createStaffMember(staff);
  }

  console.log("[Database] Staff members seeded successfully");
}

// ==================== CLIENT PORTAL FUNCTIONS ====================

export async function getClientByUserId(userId: number): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clients).where(eq(clients.userId, userId)).limit(1);
  return result[0];
}

export async function createClient(client: InsertClient): Promise<Client | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(clients).values(client);
    const insertId = result[0].insertId;
    const newClient = await db.select().from(clients).where(eq(clients.id, insertId)).limit(1);
    return newClient[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create client:", error);
    throw error;
  }
}

export async function updateClient(id: number, data: Partial<InsertClient>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(clients).set(data).where(eq(clients.id, id));
}

export async function getClientServices(clientId: number): Promise<ClientService[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(clientServices).where(eq(clientServices.clientId, clientId)).orderBy(desc(clientServices.createdAt));
}

export async function getAllClientServices(): Promise<ClientService[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(clientServices).orderBy(desc(clientServices.createdAt));
}

export async function createClientService(service: InsertClientService): Promise<ClientService | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(clientServices).values(service);
    const insertId = result[0].insertId;
    const newService = await db.select().from(clientServices).where(eq(clientServices.id, insertId)).limit(1);
    return newService[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create client service:", error);
    throw error;
  }
}

export async function updateClientServiceStatus(id: number, status: ClientService["status"], message?: string, updatedById?: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(clientServices).set({ status }).where(eq(clientServices.id, id));

  // Add update to history
  if (message) {
    await db.insert(serviceUpdates).values({
      serviceId: id,
      status,
      message,
      updatedById,
    });
  }
}

export async function getServiceUpdates(serviceId: number): Promise<ServiceUpdate[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(serviceUpdates).where(eq(serviceUpdates.serviceId, serviceId)).orderBy(desc(serviceUpdates.createdAt));
}

export async function getAllClients(): Promise<Client[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(clients).orderBy(desc(clients.createdAt));
}

// ==================== CLIENT DOCUMENT FUNCTIONS ====================

export async function createClientDocument(doc: InsertClientDocument): Promise<ClientDocument | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(clientDocuments).values(doc);
    const insertId = result[0].insertId;
    const newDoc = await db.select().from(clientDocuments).where(eq(clientDocuments.id, insertId)).limit(1);
    return newDoc[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create document:", error);
    throw error;
  }
}

export async function getClientDocuments(clientId: number): Promise<ClientDocument[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(clientDocuments).where(eq(clientDocuments.clientId, clientId)).orderBy(desc(clientDocuments.createdAt));
}

export async function getDocumentById(id: number): Promise<ClientDocument | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(clientDocuments).where(eq(clientDocuments.id, id)).limit(1);
  return result[0] || null;
}

export async function deleteClientDocument(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(clientDocuments).where(eq(clientDocuments.id, id));
}

export async function markDocumentAsProcessed(id: number, processedById: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(clientDocuments).set({
    isProcessed: true,
    processedById,
    processedAt: new Date(),
  }).where(eq(clientDocuments.id, id));
}

export async function getAllClientDocuments(): Promise<ClientDocument[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(clientDocuments).orderBy(desc(clientDocuments.createdAt));
}

// ==================== SERVICE REQUEST FUNCTIONS ====================

export async function createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(serviceRequests).values(request);
    const insertId = result[0].insertId;
    const newRequest = await db.select().from(serviceRequests).where(eq(serviceRequests.id, insertId)).limit(1);
    return newRequest[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create service request:", error);
    throw error;
  }
}

export async function getClientServiceRequests(clientId: number): Promise<ServiceRequest[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(serviceRequests).where(eq(serviceRequests.clientId, clientId)).orderBy(desc(serviceRequests.createdAt));
}

export async function getAllServiceRequests(): Promise<ServiceRequest[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
}

export async function updateServiceRequestStatus(
  id: number, 
  status: ServiceRequest["status"], 
  reviewedById?: number,
  notes?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const updateData: Partial<ServiceRequest> = { status };
  if (reviewedById) {
    updateData.reviewedById = reviewedById;
    updateData.reviewedAt = new Date();
  }
  if (notes) {
    updateData.notes = notes;
  }

  await db.update(serviceRequests).set(updateData).where(eq(serviceRequests.id, id));
}

export async function convertServiceRequestToService(
  requestId: number,
  serviceData: InsertClientService
): Promise<ClientService | null> {
  const db = await getDb();
  if (!db) return null;

  // Create the service
  const service = await createClientService(serviceData);
  if (!service) return null;

  // Update the request
  await db.update(serviceRequests).set({
    status: "converted",
    convertedToServiceId: service.id,
  }).where(eq(serviceRequests.id, requestId));

  return service;
}
