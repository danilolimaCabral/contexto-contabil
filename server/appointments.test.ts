import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createLead: vi.fn().mockResolvedValue(null),
  getLeads: vi.fn().mockResolvedValue([]),
  updateLeadStatus: vi.fn().mockResolvedValue(undefined),
  assignLeadToStaff: vi.fn().mockResolvedValue(undefined),
  getLeadsByStaff: vi.fn().mockResolvedValue([]),
  createAppointment: vi.fn().mockResolvedValue({
    id: 1,
    name: "Test Client",
    email: "client@example.com",
    phone: "62999999999",
    subject: "Abertura de empresa",
    scheduledDate: new Date(),
    status: "pending",
    createdAt: new Date(),
  }),
  getAppointments: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Test Client",
      email: "client@example.com",
      phone: "62999999999",
      subject: "Abertura de empresa",
      scheduledDate: new Date(),
      status: "pending",
      createdAt: new Date(),
    },
  ]),
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

describe("appointments.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new appointment", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.appointments.create({
      name: "Test Client",
      email: "client@example.com",
      phone: "62999999999",
      subject: "Abertura de empresa",
      scheduledDate: new Date().toISOString(),
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Test Client");
    expect(result?.status).toBe("pending");
  });
});

describe("appointments.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires authentication to list appointments", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.appointments.list()).rejects.toThrow();
  });

  it("returns appointments for authenticated users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.appointments.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Test Client");
  });
});

describe("appointments.updateStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires authentication to update status", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.appointments.updateStatus({ id: 1, status: "confirmed" })
    ).rejects.toThrow();
  });

  it("updates appointment status for authenticated users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.appointments.updateStatus({
      id: 1,
      status: "confirmed",
    });

    expect(result).toEqual({ success: true });
  });
});
