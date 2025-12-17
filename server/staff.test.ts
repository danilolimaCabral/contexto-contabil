import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllStaffMembers: vi.fn().mockResolvedValue([
    { id: 1, name: "Gabriel", department: "fiscal", position: "Analista Fiscal", isActive: true },
    { id: 2, name: "Samarah", department: "fiscal", position: "Analista Fiscal", isActive: true },
    { id: 3, name: "Laura", department: "contabil", position: "Analista Contábil", isActive: true },
  ]),
  getStaffMembers: vi.fn().mockResolvedValue([
    { id: 1, name: "Gabriel", department: "fiscal", position: "Analista Fiscal", isActive: true },
    { id: 2, name: "Samarah", department: "fiscal", position: "Analista Fiscal", isActive: true },
    { id: 3, name: "Laura", department: "contabil", position: "Analista Contábil", isActive: true },
  ]),
  getStaffByDepartment: vi.fn().mockImplementation((dept: string) => {
    const staff = [
      { id: 1, name: "Gabriel", department: "fiscal", position: "Analista Fiscal", isActive: true },
      { id: 2, name: "Samarah", department: "fiscal", position: "Analista Fiscal", isActive: true },
      { id: 3, name: "Laura", department: "contabil", position: "Analista Contábil", isActive: true },
    ];
    return Promise.resolve(staff.filter(s => s.department === dept));
  }),
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

describe("staff router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists all staff members", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.list();

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe("Gabriel");
    expect(result[0].department).toBe("fiscal");
  });

  it("filters staff by department", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.byDepartment({ department: "fiscal" });

    expect(result).toHaveLength(2);
    expect(result.every(s => s.department === "fiscal")).toBe(true);
  });

  it("returns empty array for department with no staff", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.byDepartment({ department: "paralegal" });

    expect(result).toHaveLength(0);
  });
});
