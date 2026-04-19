import { describe, it, expect } from "@jest/globals";
import {
  Pagination,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@app/lib/pagination";

describe("Pagination", () => {
  describe("from", () => {
    it("should create a pagination instance", () => {
      const pagination = Pagination.from({ page: 2, size: 10 });

      expect(pagination.page).toBe(2);
      expect(pagination.size).toBe(10);
      expect(pagination.skip).toBe(10);
    });

    it("should clamp page to 1 when page param is zero", () => {
      const pagination = Pagination.from({ page: 0, size: 10 });

      expect(pagination.page).toBe(1);
    });

    it("should clamp page to 1 when page param is negative", () => {
      const pagination = Pagination.from({ page: -5, size: 10 });

      expect(pagination.page).toBe(1);
    });

    it("should clamp size to 1 when size param is zero", () => {
      const pagination = Pagination.from({ page: 1, size: 0 });

      expect(pagination.size).toBe(1);
    });

    it("should clamp size to 1 when size param is negative", () => {
      const pagination = Pagination.from({ page: 1, size: -10 });

      expect(pagination.size).toBe(1);
    });

    it("should calculate skip correctly", () => {
      expect(Pagination.from({ page: 1, size: 20 }).skip).toBe(0);
      expect(Pagination.from({ page: 2, size: 20 }).skip).toBe(20);
      expect(Pagination.from({ page: 3, size: 10 }).skip).toBe(20);
      expect(Pagination.from({ page: 5, size: 25 }).skip).toBe(100);
    });
  });

  describe("default", () => {
    it("should create default pagination", () => {
      const pagination = Pagination.default();

      expect(pagination.page).toBe(DEFAULT_PAGE);
      expect(pagination.size).toBe(DEFAULT_PAGE_SIZE);
      expect(pagination.skip).toBe(0);
    });
  });
});
