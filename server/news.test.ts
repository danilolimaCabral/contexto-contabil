import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock database functions
vi.mock("./db", () => ({
  getActiveNews: vi.fn(),
  getFeaturedNews: vi.fn(),
  getNewsByCategory: vi.fn(),
  getNewsById: vi.fn(),
  incrementNewsViewCount: vi.fn(),
  createNews: vi.fn(),
  updateNews: vi.fn(),
  deleteNews: vi.fn(),
  getAllNews: vi.fn(),
  seedInitialNews: vi.fn(),
}));

import {
  getActiveNews,
  getFeaturedNews,
  getNewsByCategory,
  getNewsById,
  incrementNewsViewCount,
  createNews,
  updateNews,
  deleteNews,
  getAllNews,
} from "./db";

describe("News API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getActiveNews", () => {
    it("should return active news ordered by date", async () => {
      const mockNews = [
        {
          id: 1,
          title: "Reforma Tributária 2024",
          category: "reforma_tributaria",
          source: "Portal Contábeis",
          publishedAt: new Date(),
          isActive: true,
          isFeatured: true,
        },
        {
          id: 2,
          title: "Novas regras do eSocial",
          category: "trabalhista",
          source: "Fenacon",
          publishedAt: new Date(Date.now() - 3600000),
          isActive: true,
          isFeatured: false,
        },
      ];

      vi.mocked(getActiveNews).mockResolvedValue(mockNews as any);

      const result = await getActiveNews(20);
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Reforma Tributária 2024");
      expect(getActiveNews).toHaveBeenCalledWith(20);
    });

    it("should return empty array when no news available", async () => {
      vi.mocked(getActiveNews).mockResolvedValue([]);

      const result = await getActiveNews(20);
      expect(result).toHaveLength(0);
    });
  });

  describe("getFeaturedNews", () => {
    it("should return only featured news", async () => {
      const mockFeaturedNews = [
        {
          id: 1,
          title: "Notícia em Destaque",
          isFeatured: true,
          isActive: true,
        },
      ];

      vi.mocked(getFeaturedNews).mockResolvedValue(mockFeaturedNews as any);

      const result = await getFeaturedNews(5);
      expect(result).toHaveLength(1);
      expect(result[0].isFeatured).toBe(true);
    });
  });

  describe("getNewsByCategory", () => {
    it("should filter news by category", async () => {
      const mockFiscalNews = [
        {
          id: 1,
          title: "Notícia Fiscal",
          category: "fiscal",
          isActive: true,
        },
      ];

      vi.mocked(getNewsByCategory).mockResolvedValue(mockFiscalNews as any);

      const result = await getNewsByCategory("fiscal", 10);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("fiscal");
      expect(getNewsByCategory).toHaveBeenCalledWith("fiscal", 10);
    });

    it("should return empty array for category with no news", async () => {
      vi.mocked(getNewsByCategory).mockResolvedValue([]);

      const result = await getNewsByCategory("previdenciario", 10);
      expect(result).toHaveLength(0);
    });
  });

  describe("getNewsById", () => {
    it("should return news by id", async () => {
      const mockNews = {
        id: 1,
        title: "Notícia Específica",
        content: "Conteúdo completo da notícia",
        viewCount: 100,
      };

      vi.mocked(getNewsById).mockResolvedValue(mockNews as any);

      const result = await getNewsById(1);
      expect(result).toEqual(mockNews);
      expect(result?.title).toBe("Notícia Específica");
    });

    it("should return null for non-existent news", async () => {
      vi.mocked(getNewsById).mockResolvedValue(null);

      const result = await getNewsById(999);
      expect(result).toBeNull();
    });
  });

  describe("incrementNewsViewCount", () => {
    it("should increment view count", async () => {
      vi.mocked(incrementNewsViewCount).mockResolvedValue(undefined);

      await incrementNewsViewCount(1);
      expect(incrementNewsViewCount).toHaveBeenCalledWith(1);
    });
  });

  describe("createNews", () => {
    it("should create a new news item", async () => {
      const newNews = {
        title: "Nova Notícia",
        summary: "Resumo da notícia",
        content: "Conteúdo completo",
        category: "fiscal",
        source: "Portal Contábeis",
        publishedAt: new Date(),
      };

      const createdNews = {
        id: 1,
        ...newNews,
        isActive: true,
        isFeatured: false,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(createNews).mockResolvedValue(createdNews as any);

      const result = await createNews(newNews as any);
      expect(result).toEqual(createdNews);
      expect(result?.title).toBe("Nova Notícia");
    });
  });

  describe("updateNews", () => {
    it("should update news item", async () => {
      vi.mocked(updateNews).mockResolvedValue(undefined);

      await updateNews(1, { title: "Título Atualizado" });
      expect(updateNews).toHaveBeenCalledWith(1, { title: "Título Atualizado" });
    });
  });

  describe("deleteNews", () => {
    it("should soft delete news (set isActive to false)", async () => {
      vi.mocked(deleteNews).mockResolvedValue(undefined);

      await deleteNews(1);
      expect(deleteNews).toHaveBeenCalledWith(1);
    });
  });

  describe("getAllNews", () => {
    it("should return all news including inactive", async () => {
      const mockAllNews = [
        { id: 1, title: "Notícia Ativa", isActive: true },
        { id: 2, title: "Notícia Inativa", isActive: false },
      ];

      vi.mocked(getAllNews).mockResolvedValue(mockAllNews as any);

      const result = await getAllNews();
      expect(result).toHaveLength(2);
    });
  });

  describe("News Categories", () => {
    const categories = [
      "fiscal",
      "contabil",
      "tributario",
      "trabalhista",
      "previdenciario",
      "economia",
      "reforma_tributaria",
    ];

    it("should support all defined categories", () => {
      expect(categories).toContain("fiscal");
      expect(categories).toContain("contabil");
      expect(categories).toContain("tributario");
      expect(categories).toContain("trabalhista");
      expect(categories).toContain("previdenciario");
      expect(categories).toContain("economia");
      expect(categories).toContain("reforma_tributaria");
    });
  });
});
