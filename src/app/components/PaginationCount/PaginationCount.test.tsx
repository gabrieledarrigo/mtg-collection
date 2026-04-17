import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { PaginationCount } from "./PaginationCount";

describe("PaginationCount", () => {
  const currentPage = 2;
  const size = 12;
  const totalItems = 96;

  it("should render the pagination count", () => {
    render(
      <PaginationCount
        currentPage={currentPage}
        size={size}
        totalItems={totalItems}
      />,
    );

    expect(screen.getByText("13 - 24 of 96 items")).toBeInTheDocument();
  });

  it("should handle 0 total items", () => {
    render(
      <PaginationCount currentPage={currentPage} size={size} totalItems={0} />,
    );

    expect(screen.getByText("0 items in your collection")).toBeInTheDocument();
  });

  it("should always cap the last page item", () => {
    render(<PaginationCount currentPage={8} size={size} totalItems={90} />);

    expect(screen.getByText("85 - 90 of 90 items")).toBeInTheDocument();
  });

  it("should render the custom itemName", () => {
    render(
      <PaginationCount
        currentPage={currentPage}
        size={size}
        totalItems={totalItems}
        itemsName="cards"
      />,
    );

    expect(screen.getByText("13 - 24 of 96 cards")).toBeInTheDocument();
  });
});
