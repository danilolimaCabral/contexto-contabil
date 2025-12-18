import { eq, desc, and, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, Lead, appointments, InsertAppointment, Appointment, chatMessages, InsertChatMessage, ChatMessage, testimonials, Testimonial, staffMembers, StaffMember, InsertStaffMember, clients, Client, InsertClient, clientServices, ClientService, InsertClientService, serviceUpdates, ServiceUpdate, InsertServiceUpdate, clientDocuments, ClientDocument, InsertClientDocument, serviceRequests, ServiceRequest, InsertServiceRequest, news, News, InsertNews } from "../drizzle/schema";
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

// ==================== NEWS FUNCTIONS ====================

export async function createNews(newsItem: InsertNews): Promise<News | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(news).values(newsItem);
    const insertId = result[0].insertId;
    const newNews = await db.select().from(news).where(eq(news.id, insertId)).limit(1);
    return newNews[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create news:", error);
    throw error;
  }
}

export async function getActiveNews(limit: number = 20): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(news)
    .where(eq(news.isActive, true))
    .orderBy(desc(news.publishedAt))
    .limit(limit);
}

export async function getFeaturedNews(limit: number = 5): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(news)
    .where(and(eq(news.isActive, true), eq(news.isFeatured, true)))
    .orderBy(desc(news.publishedAt))
    .limit(limit);
}

export async function getNewsByCategory(category: News["category"], limit: number = 10): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(news)
    .where(and(eq(news.isActive, true), eq(news.category, category)))
    .orderBy(desc(news.publishedAt))
    .limit(limit);
}

export async function getNewsById(id: number): Promise<News | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return result[0] || null;
}

export async function incrementNewsViewCount(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const currentNews = await getNewsById(id);
  if (currentNews) {
    await db.update(news).set({ viewCount: (currentNews.viewCount || 0) + 1 }).where(eq(news.id, id));
  }
}

export async function updateNews(id: number, data: Partial<InsertNews>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(news).set(data).where(eq(news.id, id));
}

export async function deleteNews(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(news).set({ isActive: false }).where(eq(news.id, id));
}

export async function getAllNews(): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(news).orderBy(desc(news.publishedAt));
}

export async function seedInitialNews(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existingNews = await getActiveNews(1);
  if (existingNews.length > 0) return; // Already seeded

  const initialNews: InsertNews[] = [
    {
      title: "Reforma Tributária 2024: Novo IVA unifica PIS, Cofins, ICMS, ISS e IPI em imposto único",
      summary: "A Câmara dos Deputados aprovou o projeto de lei complementar que regulamenta a reforma tributária, unificando cinco tributos em um único imposto sobre valor agregado (IVA dual).",
      content: "A reforma tributária representa a maior mudança no sistema de impostos brasileiro em décadas. O novo modelo substitui cinco tributos (PIS, Cofins, IPI, ICMS e ISS) por dois novos impostos: a CBS (Contribuição sobre Bens e Serviços), de competência federal, e o IBS (Imposto sobre Bens e Serviços), de competência estadual e municipal.",
      category: "reforma_tributaria",
      source: "Portal Contábeis",
      sourceUrl: "https://www.contabeis.com.br",
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: "CBS e IBS: Novos impostos começam a ser implementados gradualmente a partir de 2026",
      summary: "O período de transição para os novos tributos CBS e IBS terá início em janeiro de 2026, com alíquotas reduzidas durante a fase de testes.",
      content: "A implementação dos novos impostos será gradual, começando com alíquotas de teste em 2026. A CBS terá alíquota de 0,9% e o IBS de 0,1% durante o período experimental. A transição completa está prevista para ser concluída até 2033.",
      category: "tributario",
      source: "Receita Federal",
      sourceUrl: "https://www.gov.br/receitafederal",
      isFeatured: true,
      publishedAt: new Date(Date.now() - 3600000),
    },
    {
      title: "Imposto sobre dividendos também atinge empresas do Simples Nacional",
      summary: "Receita Federal esclarece que lucros e dividendos de empresas do Simples Nacional estarão sujeitos ao Imposto de Renda Mínimo a partir de 2026.",
      content: "Em esclarecimento recente, a Receita Federal confirmou que as empresas optantes pelo Simples Nacional também serão afetadas pela tributação sobre dividendos prevista na reforma tributária. A medida visa garantir maior equidade tributária entre os diferentes regimes.",
      category: "fiscal",
      source: "Portal Contábeis",
      sourceUrl: "https://www.contabeis.com.br",
      isFeatured: true,
      publishedAt: new Date(Date.now() - 7200000),
    },
    {
      title: "eSocial: Novas regras para declaração de eventos trabalhistas entram em vigor",
      summary: "Empresas devem se adequar às novas regras do eSocial que entram em vigor em 2025, com prazos mais rigorosos para envio de informações.",
      content: "O eSocial passa por mais uma atualização importante. As empresas precisam estar atentas aos novos prazos e formatos de envio de eventos trabalhistas, incluindo admissões, demissões e alterações contratuais.",
      category: "trabalhista",
      source: "Fenacon",
      sourceUrl: "https://fenacon.org.br",
      isFeatured: false,
      publishedAt: new Date(Date.now() - 10800000),
    },
    {
      title: "Receita Federal quase dobra lista de benefícios fiscais da DIRBI",
      summary: "Receita Federal inclui 85 novos benefícios fiscais na DIRBI e declaração passa a ter 173 incentivos tributários.",
      content: "A Receita Federal ampliou significativamente a lista de benefícios fiscais que devem ser declarados na DIRBI (Declaração de Incentivos, Renúncias, Benefícios e Imunidades de Natureza Tributária). A medida visa aumentar a transparência sobre os incentivos fiscais concedidos.",
      category: "fiscal",
      source: "Agência Brasil",
      sourceUrl: "https://agenciabrasil.ebc.com.br",
      isFeatured: false,
      publishedAt: new Date(Date.now() - 86400000),
    },
    {
      title: "Carga tributária brasileira atinge 32,2% do PIB em 2024",
      summary: "Brasil registra a maior carga tributária bruta dos últimos 22 anos, com alta de 1,98 ponto porcentual em relação ao ano anterior.",
      content: "Os dados divulgados mostram que a carga tributária brasileira atingiu seu maior patamar em mais de duas décadas. O aumento reflete tanto o crescimento da arrecadação quanto as mudanças na estrutura tributária do país.",
      category: "economia",
      source: "Portal Contábil SC",
      sourceUrl: "https://portalcontabilsc.com.br",
      isFeatured: false,
      publishedAt: new Date(Date.now() - 172800000),
    },
    {
      title: "Comitê Gestor do IBS divulga orientações sobre entrada em vigor dos novos impostos",
      summary: "Documento esclarece as obrigações dos contribuintes durante o período de transição da reforma tributária.",
      content: "O Comitê Gestor do IBS, em conjunto com a Receita Federal, publicou documento com orientações detalhadas sobre como os contribuintes devem se preparar para a entrada em vigor da CBS e do IBS em janeiro de 2026.",
      category: "tributario",
      source: "Secretaria da Fazenda RS",
      sourceUrl: "https://fazenda.rs.gov.br",
      isFeatured: false,
      publishedAt: new Date(Date.now() - 259200000),
    },
    {
      title: "IRPF 2025: Rendimentos até R$ 7.350 terão redução do imposto",
      summary: "Nova faixa de isenção e alíquotas reduzidas beneficiarão contribuintes de menor renda no próximo ano.",
      content: "A Receita Federal anunciou mudanças nas faixas de tributação do Imposto de Renda Pessoa Física para 2025. Contribuintes com rendimentos tributáveis até R$ 7.350,00 terão redução significativa no imposto devido.",
      category: "fiscal",
      source: "Receita Federal",
      sourceUrl: "https://www.gov.br/receitafederal",
      isFeatured: true,
      publishedAt: new Date(Date.now() - 345600000),
    },
    {
      title: "Novas regras de tributação sobre altas rendas: Receita publica guia explicativo",
      summary: "Documento de Perguntas e Respostas esclarece aplicação da Lei nº 15.270/2025 sobre tributação de altas rendas.",
      content: "A Receita Federal divulgou um guia completo com perguntas e respostas sobre as novas regras de tributação para contribuintes de alta renda. O documento esclarece dúvidas sobre a aplicação da nova legislação.",
      category: "fiscal",
      source: "Fenacon",
      sourceUrl: "https://fenacon.org.br",
      isFeatured: false,
      publishedAt: new Date(Date.now() - 432000000),
    },
    {
      title: "Previdência Social: Novas regras para aposentadoria especial em 2025",
      summary: "INSS atualiza critérios para concessão de aposentadoria especial, afetando trabalhadores expostos a agentes nocivos.",
      content: "O INSS publicou novas instruções normativas que alteram os critérios para concessão de aposentadoria especial. As mudanças afetam principalmente trabalhadores que exercem atividades em condições prejudiciais à saúde.",
      category: "previdenciario",
      source: "INSS",
      sourceUrl: "https://www.gov.br/inss",
      isFeatured: false,
      publishedAt: new Date(Date.now() - 518400000),
    },
  ];

  for (const item of initialNews) {
    await createNews(item);
  }
}

export async function searchNews(query: string, limit: number = 20): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];

  const searchTerm = `%${query}%`;
  
  return db.select().from(news)
    .where(
      and(
        eq(news.isActive, true),
        or(
          like(news.title, searchTerm),
          like(news.summary, searchTerm),
          like(news.content, searchTerm)
        )
      )
    )
    .orderBy(desc(news.publishedAt))
    .limit(limit);
}
