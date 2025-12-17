import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllStaffMembers: vi.fn().mockResolvedValue([
    { id: 1, name: "Gabriel", department: "fiscal", isActive: true },
    { id: 2, name: "Samarah", department: "fiscal", isActive: true },
    { id: 3, name: "Laura", department: "contabil", isActive: true },
  ]),
  getStaffMembers: vi.fn().mockResolvedValue([
    { id: 1, name: "Gabriel", department: "fiscal", isActive: true },
    { id: 2, name: "Samarah", department: "fiscal", isActive: true },
  ]),
  getStaffByDepartment: vi.fn().mockResolvedValue([
    { id: 1, name: "Gabriel", department: "fiscal", isActive: true },
  ]),
  createStaffMember: vi.fn().mockResolvedValue({ id: 4, name: "Novo Funcionário", department: "pessoal" }),
  updateStaffMember: vi.fn().mockResolvedValue(undefined),
  deactivateStaffMember: vi.fn().mockResolvedValue(undefined),
  reactivateStaffMember: vi.fn().mockResolvedValue(undefined),
  seedStaffMembers: vi.fn().mockResolvedValue(undefined),
  createLead: vi.fn(),
  getLeads: vi.fn(),
  updateLeadStatus: vi.fn(),
  assignLeadToStaff: vi.fn(),
  createAppointment: vi.fn(),
  getAppointments: vi.fn(),
  updateAppointmentStatus: vi.fn(),
  assignAppointmentToStaff: vi.fn(),
  getAppointmentsByStaff: vi.fn(),
  saveChatMessage: vi.fn(),
  getChatHistory: vi.fn(),
  getActiveTestimonials: vi.fn(),
  createTestimonial: vi.fn(),
  getLeadsByStaff: vi.fn(),
  getClientByUserId: vi.fn(),
  createClient: vi.fn(),
  updateClient: vi.fn(),
  getClientServices: vi.fn(),
  getAllClientServices: vi.fn(),
  createClientService: vi.fn(),
  updateClientServiceStatus: vi.fn(),
  getServiceUpdates: vi.fn(),
  getAllClients: vi.fn(),
  createClientDocument: vi.fn(),
  getClientDocuments: vi.fn(),
  getDocumentById: vi.fn(),
  deleteClientDocument: vi.fn(),
  markDocumentAsProcessed: vi.fn(),
  getAllClientDocuments: vi.fn(),
  createServiceRequest: vi.fn(),
  getClientServiceRequests: vi.fn(),
  getAllServiceRequests: vi.fn(),
  updateServiceRequestStatus: vi.fn(),
  convertServiceRequestToService: vi.fn(),
  getActiveNews: vi.fn(),
  getFeaturedNews: vi.fn(),
  getNewsByCategory: vi.fn(),
  getNewsById: vi.fn(),
  incrementNewsViewCount: vi.fn(),
  createNews: vi.fn(),
  updateNews: vi.fn(),
  deleteNews: vi.fn(),
  getAllNews: vi.fn(),
  seedInitialNews: vi.fn().mockResolvedValue(undefined),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@contexto.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("staff management routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists all staff members (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.list();

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty("name", "Gabriel");
  });

  it("lists active staff members only", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.listActive();

    expect(result).toHaveLength(2);
  });

  it("filters staff by department", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.byDepartment({ department: "fiscal" });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("department", "fiscal");
  });

  it("creates a new staff member (authenticated)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.create({
      name: "Novo Funcionário",
      department: "pessoal",
      email: "novo@contexto.com",
    });

    expect(result).toHaveProperty("id", 4);
    expect(result).toHaveProperty("name", "Novo Funcionário");
  });

  it("updates a staff member (authenticated)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.update({
      id: 1,
      name: "Gabriel Atualizado",
      position: "Analista Fiscal Senior",
    });

    expect(result).toEqual({ success: true });
  });

  it("deactivates a staff member (authenticated)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.deactivate({ id: 1 });

    expect(result).toEqual({ success: true });
  });

  it("reactivates a staff member (authenticated)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.reactivate({ id: 1 });

    expect(result).toEqual({ success: true });
  });

  it("requires authentication for create", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.staff.create({
        name: "Teste",
        department: "fiscal",
      })
    ).rejects.toThrow();
  });

  it("requires authentication for deactivate", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.staff.deactivate({ id: 1 })).rejects.toThrow();
  });
});
