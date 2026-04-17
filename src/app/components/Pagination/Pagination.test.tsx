import { describe, it, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  const currentPage = 2;
  const size = 12;
  const totalItems = 96;

  it("should render page buttons", () => {
    render(
      <Pagination
        currentPage={currentPage}
        size={size}
        totalItems={totalItems}
        onPageChange={jest.fn()}
        onSizeChange={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Previous" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument();
  });

  it("should disable the Previous button when the current page is the 1", () => {
    render(
      <Pagination
        currentPage={1}
        size={size}
        totalItems={totalItems}
        onPageChange={jest.fn()}
        onSizeChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("should disable the Next button when the current page is the last page", () => {
    render(
      <Pagination
        currentPage={8}
        size={size}
        totalItems={totalItems}
        onPageChange={jest.fn()}
        onSizeChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("should disable the Previous and Next button when there is only one page", () => {
    render(
      <Pagination
        currentPage={1}
        size={12}
        totalItems={12}
        onPageChange={jest.fn()}
        onSizeChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
  });

  it("should render two ellipsis when...", () => {
    render(
      <Pagination
        currentPage={6}
        size={12}
        totalItems={240}
        onPageChange={jest.fn()}
        onSizeChange={jest.fn()}
      />,
    );

    expect(screen.getAllByText("...")).toHaveLength(2);
  });

  it("should call onPageChange with the page number when clicking a page button", () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={currentPage}
        size={size}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onSizeChange={jest.fn()}
      />,
    );

    screen.getByRole("button", { name: "3" }).click();

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("should call onPageChange with the previous page when clicking Previous", () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={currentPage}
        size={size}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onSizeChange={jest.fn()}
      />,
    );

    screen.getByRole("button", { name: "Previous" }).click();

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("should call onPageChange with the next page when clicking Next", () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={currentPage}
        size={size}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onSizeChange={jest.fn()}
      />,
    );

    screen.getByRole("button", { name: "Next" }).click();

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
