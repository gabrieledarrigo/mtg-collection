import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { PaginationView } from "./PaginationView";
import { Page } from "@app/lib/pagination";
import { CollectionItem } from "@database/models";
import { createMock } from "@test/helpers";
import * as hook from "@app/hooks/useUpdateSearchParams";
import * as navigation from "next/navigation";

jest.mock("next/navigation");
jest.mock("@app/hooks/useUpdateSearchParams");

describe("PaginationView", () => {
  const updateSearchParams = jest.fn();

  const searchParams = createMock<navigation.ReadonlyURLSearchParams>({
    entries: () => [],
  });

  beforeEach(() => {
    jest.spyOn(navigation, "useSearchParams").mockReturnValue(searchParams);
    jest
      .spyOn(hook, "useUpdateSearchParams")
      .mockReturnValue(updateSearchParams);
  });

  const collectionItems: Page<CollectionItem> = {
    items: [],
    size: 12,
    page: 2,
    totalItems: 100,
  };

  it("should render page buttons", () => {
    render(<PaginationView collectionItems={collectionItems} />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Next" })).toBeDefined();
    expect(screen.getByRole("button", { name: "1" })).toBeDefined();
    expect(screen.getByRole("button", { name: "2" })).toBeDefined();
  });

  it("should render the items count", () => {
    render(<PaginationView collectionItems={collectionItems} />);

    expect(screen.getByText("13 - 24 of 100 cards")).toBeDefined();
  });

  it("should call updateSearchParams with the page number when clicking a page button", () => {
    render(<PaginationView collectionItems={collectionItems} />);

    screen.getByRole("button", { name: "3" }).click();

    expect(updateSearchParams).toHaveBeenCalledWith({ page: "3" });
  });

  it("should call updateSearchParams with the previous page when clicking Previous", () => {
    render(<PaginationView collectionItems={collectionItems} />);

    screen.getByRole("button", { name: "Previous" }).click();

    expect(updateSearchParams).toHaveBeenCalledWith({ page: "1" });
  });

  it("should call updateSearchParams with the next page when clicking Next", () => {
    render(<PaginationView collectionItems={collectionItems} />);

    screen.getByRole("button", { name: "Next" }).click();

    expect(updateSearchParams).toHaveBeenCalledWith({ page: "3" });
  });
});
