import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createLead: vi.fn().mockResolvedValue({
    id: 1,
    name: "Test User",
    email: "test@example.com",
    phone: "62999999999",
    company: "Test Company",
    message: "Test message",
    source: "contact_form",
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getLeads: vi.fn().mockResolvedValue([]),
  updateLeadStatus: vi.fn().mockResolvedValue(undefined),
  assignLeadToStaff: vi.fn().mockResolvedValue(undefined),
  getLeadsByStaff: vi.fn().mockResolvedValue([]),
  createAppointment: vi.fn().mockResolvedValue(null),
  getAppointments: vi.fn().mockResolvedValue([]),
  updateAppointmentStatus: vi.fn().mockResolvedValue(undefined),
  assignAppointmentToStaff: vi.fn().mockResolvedValue(undefined),
  getAppointmentsByStaff: vi.fn().mockResolvedValue([]),
  saveChatMessage: vi.fn().mockResolvedValue(undefined),
  getChatHistory: vi.fn().mockResolvedValue([]),
  getActiveTestimonials: vi.fn().mockResolvedValue([]),
  createTestimonial: vi.fn().mockResolvedValue(undefined),
  getStaffMembers: vi.fn().mockResolvedValue([]),
  getStaffByDepartment: vi.fn().mockResolvedValue([]),
  seedStaffMembers: vi.fn().mockResolvedValue(undefined),
  getAllStaffMembers: vi.fn().mockResolvedValue([]),
  createStaffMember: vi.fn(),
  updateStaffMember: vi.fn(),
  deactivateStaffMember: vi.fn(),
  reactivateStaffMember: vi.fn(),
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

// Mock the notification function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the LLM function
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Test response" } }],
  }),
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
      openId: "test-user",
      email: "admin@example.com",
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

describe("leads.create", () => {
  it("creates a new lead from contact form", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.create({
      name: "Test User",
      email: "test@example.com",
      phone: "62999999999",
      company: "Test Company",
      message: "Test message",
      source: "contact_form",
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Test User");
    expect(result?.email).toBe("test@example.com");
    expect(result?.source).toBe("contact_form");
  });

  it("creates a lead with minimal data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.create({
      name: "Minimal User",
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Test User"); // From mock
  });
});

describe("leads.list", () => {
  it("requires authentication to list leads", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.leads.list()).rejects.toThrow();
  });

  it("returns leads for authenticated users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.list();

    expect(Array.isArray(result)).toBe(true);
  });
});
