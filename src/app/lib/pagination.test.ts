import { describe, it, expect } from "@jest/globals";
import {
  Pagination,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@app/lib/pagination";

describe("Pagination", () => {
  it("should create pagination from valid params", () => {
    const pagination = Pagination.fromParams({ page: "2", size: "10" });

    expect(pagination.page).toBe(2);
    expect(pagination.size).toBe(10);
    expect(pagination.skip).toBe(10);
  });

  it("should use default page when page param is missing", () => {
    const pagination = Pagination.fromParams({ size: "10" });

    expect(pagination.page).toBe(DEFAULT_PAGE);
    expect(pagination.size).toBe(10);
  });

  it("should use default size when size param is missing", () => {
    const pagination = Pagination.fromParams({ page: "2" });

    expect(pagination.page).toBe(2);
    expect(pagination.size).toBe(DEFAULT_PAGE_SIZE);
  });

  it("should use defaults when params is empty", () => {
    const pagination = Pagination.fromParams({});

    expect(pagination.page).toBe(DEFAULT_PAGE);
    expect(pagination.size).toBe(DEFAULT_PAGE_SIZE);
  });

  it("should use default page when page param is not a number", () => {
    const pagination = Pagination.fromParams({ page: "invalid", size: "10" });

    expect(pagination.page).toBe(DEFAULT_PAGE);
    expect(pagination.size).toBe(10);
  });

  it("should use default size when size param is not a number", () => {
    const pagination = Pagination.fromParams({ page: "2", size: "invalid" });

    expect(pagination.page).toBe(2);
    expect(pagination.size).toBe(DEFAULT_PAGE_SIZE);
  });

  it("should clamp page to 1 when page param is zero", () => {
    const pagination = Pagination.fromParams({ page: "0", size: "10" });

    expect(pagination.page).toBe(1);
  });

  it("should clamp page to 1 when page param is negative", () => {
    const pagination = Pagination.fromParams({ page: "-5", size: "10" });

    expect(pagination.page).toBe(1);
  });

  it("should clamp size to 1 when size param is zero", () => {
    const pagination = Pagination.fromParams({ page: "1", size: "0" });

    expect(pagination.size).toBe(1);
  });

  it("should clamp size to 1 when size param is negative", () => {
    const pagination = Pagination.fromParams({ page: "1", size: "-10" });

    expect(pagination.size).toBe(1);
  });

  it("should calculate skip correctly", () => {
    expect(Pagination.fromParams({ page: "1", size: "20" }).skip).toBe(0);
    expect(Pagination.fromParams({ page: "2", size: "20" }).skip).toBe(20);
    expect(Pagination.fromParams({ page: "3", size: "10" }).skip).toBe(20);
    expect(Pagination.fromParams({ page: "5", size: "25" }).skip).toBe(100);
  });

  it("should create default pagination", () => {
    const pagination = Pagination.default();

    expect(pagination.page).toBe(DEFAULT_PAGE);
    expect(pagination.size).toBe(DEFAULT_PAGE_SIZE);
    expect(pagination.skip).toBe(0);
  });
});
