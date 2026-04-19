import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { FilterBar } from "../FilterBar/FilterBar";
import { ViewToggle } from "@app/lib/types";
import * as navigation from "next/navigation";
import * as hook from "@app/hooks/useUpdateSearchParams";

jest.mock("next/navigation");
jest.mock("@app/hooks/useUpdateSearchParams");

describe("FilterBar", () => {
  const searchParams =
    new URLSearchParams() as navigation.ReadonlyURLSearchParams;

  const setSearchParams = jest.fn();

  beforeEach(() => {
    jest.spyOn(navigation, "useSearchParams").mockReturnValue(searchParams);
    jest.spyOn(hook, "useUpdateSearchParams").mockReturnValue(setSearchParams);
  });

  it("should render a toggle with a grid and table option", () => {
    render(<FilterBar />);

    const gridToggle = screen.getByRole("button", { name: "Grid view" });
    const tableToggle = screen.getByRole("button", { name: "Table view" });

    expect(gridToggle).toBeInTheDocument();
    expect(tableToggle).toBeInTheDocument();
  });

  it("should select the grid toggle by default", () => {
    render(<FilterBar />);

    const gridToggle = screen.getByRole("button", { name: "Grid view" });

    expect(gridToggle).toHaveAttribute("aria-pressed");
  });

  it("should select the table toggle when the search parameter view is equal to table", () => {
    const withTableView = new URLSearchParams([
      ["view", ViewToggle.TABLE],
    ]) as navigation.ReadonlyURLSearchParams;

    jest.spyOn(navigation, "useSearchParams").mockReturnValue(withTableView);

    render(<FilterBar />);

    const tableToggle = screen.getByRole("button", { name: "Table view" });

    expect(tableToggle).toHaveAttribute("aria-pressed");
  });

  it("should select the toggle clicked by the user", () => {
    render(<FilterBar />);

    const gridToggle = screen.getByRole("button", { name: "Grid view" });
    const tableToggle = screen.getByRole("button", { name: "Table view" });

    expect(gridToggle).toHaveAttribute("aria-pressed");

    tableToggle.click();

    expect(tableToggle).toHaveAttribute("aria-pressed");
  });
});
