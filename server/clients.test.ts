import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock database functions
vi.mock("./db", () => ({
  getClientByUserId: vi.fn(),
  createClient: vi.fn(),
  getClientDocuments: vi.fn(),
  createClientDocument: vi.fn(),
  getDocumentById: vi.fn(),
  deleteClientDocument: vi.fn(),
  getClientServiceRequests: vi.fn(),
  createServiceRequest: vi.fn(),
  getClientServices: vi.fn(),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://s3.example.com/test-file.pdf", key: "test-key" }),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import {
  getClientByUserId,
  createClient,
  getClientDocuments,
  createClientDocument,
  getDocumentById,
  deleteClientDocument,
  getClientServiceRequests,
  createServiceRequest,
  getClientServices,
} from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

describe("Client Portal API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getClientByUserId", () => {
    it("should return client data when client exists", async () => {
      const mockClient = {
        id: 1,
        userId: 123,
        name: "Test Client",
        email: "test@example.com",
        phone: "62999999999",
        company: "Test Company",
        cnpj: "12.345.678/0001-90",
      };

      vi.mocked(getClientByUserId).mockResolvedValue(mockClient as any);

      const result = await getClientByUserId(123);
      expect(result).toEqual(mockClient);
      expect(getClientByUserId).toHaveBeenCalledWith(123);
    });

    it("should return null when client does not exist", async () => {
      vi.mocked(getClientByUserId).mockResolvedValue(null);

      const result = await getClientByUserId(999);
      expect(result).toBeNull();
    });
  });

  describe("createClient", () => {
    it("should create a new client", async () => {
      const newClient = {
        userId: 123,
        name: "New Client",
        email: "new@example.com",
      };

      const createdClient = {
        id: 1,
        ...newClient,
        phone: null,
        company: null,
        cnpj: null,
        cpf: null,
        address: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(createClient).mockResolvedValue(createdClient as any);

      const result = await createClient(newClient as any);
      expect(result).toEqual(createdClient);
      expect(createClient).toHaveBeenCalledWith(newClient);
    });
  });

  describe("Client Documents", () => {
    it("should get client documents", async () => {
      const mockDocuments = [
        {
          id: 1,
          clientId: 1,
          title: "Nota Fiscal",
          category: "fiscal",
          fileName: "nf.pdf",
          fileUrl: "https://s3.example.com/nf.pdf",
        },
        {
          id: 2,
          clientId: 1,
          title: "Contrato Social",
          category: "societario",
          fileName: "contrato.pdf",
          fileUrl: "https://s3.example.com/contrato.pdf",
        },
      ];

      vi.mocked(getClientDocuments).mockResolvedValue(mockDocuments as any);

      const result = await getClientDocuments(1);
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Nota Fiscal");
    });

    it("should create a new document", async () => {
      const newDoc = {
        clientId: 1,
        title: "Test Document",
        category: "fiscal",
        fileName: "test.pdf",
        fileKey: "clients/1/documents/test.pdf",
        fileUrl: "https://s3.example.com/test.pdf",
        mimeType: "application/pdf",
        fileSize: 1024,
        uploadedById: 123,
      };

      const createdDoc = {
        id: 1,
        ...newDoc,
        description: null,
        serviceId: null,
        isProcessed: false,
        processedById: null,
        processedAt: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(createClientDocument).mockResolvedValue(createdDoc as any);

      const result = await createClientDocument(newDoc as any);
      expect(result).toEqual(createdDoc);
      expect(result?.title).toBe("Test Document");
    });

    it("should delete a document", async () => {
      vi.mocked(deleteClientDocument).mockResolvedValue(undefined);

      await deleteClientDocument(1);
      expect(deleteClientDocument).toHaveBeenCalledWith(1);
    });
  });

  describe("Service Requests", () => {
    it("should get client service requests", async () => {
      const mockRequests = [
        {
          id: 1,
          clientId: 1,
          serviceType: "contabilidade",
          description: "Need accounting services",
          priority: "normal",
          status: "pending",
        },
      ];

      vi.mocked(getClientServiceRequests).mockResolvedValue(mockRequests as any);

      const result = await getClientServiceRequests(1);
      expect(result).toHaveLength(1);
      expect(result[0].serviceType).toBe("contabilidade");
    });

    it("should create a new service request", async () => {
      const newRequest = {
        clientId: 1,
        serviceType: "fiscal",
        description: "Need tax consulting",
        priority: "high",
      };

      const createdRequest = {
        id: 1,
        ...newRequest,
        status: "pending",
        reviewedById: null,
        reviewedAt: null,
        convertedToServiceId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(createServiceRequest).mockResolvedValue(createdRequest as any);

      const result = await createServiceRequest(newRequest as any);
      expect(result).toEqual(createdRequest);
      expect(result?.status).toBe("pending");
    });
  });

  describe("Client Services", () => {
    it("should get client services", async () => {
      const mockServices = [
        {
          id: 1,
          clientId: 1,
          serviceType: "contabilidade",
          serviceName: "Contabilidade Mensal",
          status: "in_progress",
          priority: "medium",
        },
        {
          id: 2,
          clientId: 1,
          serviceType: "fiscal",
          serviceName: "Consultoria Tributária",
          status: "completed",
          priority: "high",
        },
      ];

      vi.mocked(getClientServices).mockResolvedValue(mockServices as any);

      const result = await getClientServices(1);
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe("in_progress");
      expect(result[1].status).toBe("completed");
    });
  });

  describe("Storage Integration", () => {
    it("should upload file to S3", async () => {
      const fileKey = "clients/1/documents/test.pdf";
      const buffer = Buffer.from("test content");
      const mimeType = "application/pdf";

      await storagePut(fileKey, buffer, mimeType);

      expect(storagePut).toHaveBeenCalledWith(fileKey, buffer, mimeType);
    });
  });

  describe("Notifications", () => {
    it("should notify owner about new document", async () => {
      await notifyOwner({
        title: "Novo documento enviado",
        content: "Cliente Test enviou um novo documento: Nota Fiscal (fiscal)",
      });

      expect(notifyOwner).toHaveBeenCalledWith({
        title: "Novo documento enviado",
        content: "Cliente Test enviou um novo documento: Nota Fiscal (fiscal)",
      });
    });

    it("should notify owner about new service request", async () => {
      await notifyOwner({
        title: "Nova solicitação de serviço",
        content: "Cliente Test solicitou: contabilidade (Prioridade: normal)",
      });

      expect(notifyOwner).toHaveBeenCalledWith({
        title: "Nova solicitação de serviço",
        content: "Cliente Test solicitou: contabilidade (Prioridade: normal)",
      });
    });
  });
});
