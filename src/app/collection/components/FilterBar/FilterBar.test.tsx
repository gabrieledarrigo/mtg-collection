import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { FilterBar, ViewToggle } from "../FilterBar/FilterBar";
import * as navigation from "next/navigation";
import * as hook from "@app/hooks/useUpdateSearchParams";
import { createMock } from "@test/helpers";

jest.mock("next/navigation");
jest.mock("@app/hooks/useUpdateSearchParams");

describe("CollectionView", () => {
  const searchParams = createMock<navigation.ReadonlyURLSearchParams>({
    get: jest.fn(),
  });

  const setSearchParams = jest.fn();

  beforeEach(() => {
    jest.spyOn(navigation, "useSearchParams").mockReturnValue(searchParams);
    jest.spyOn(hook, "useUpdateSearchParams").mockReturnValue(setSearchParams);
  });

  it("should render a toggle with a grid and table option", () => {
    render(<FilterBar />);

    expect(
      screen.getByRole("button", { name: "Grid view" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Table view" }),
    ).toBeInTheDocument();
  });

  it("should select the grid toggle by default", () => {
    render(<FilterBar />);

    expect(screen.getByRole("button", { name: "Grid view" })).toHaveAttribute(
      "aria-pressed",
    );
  });

  it("should select the table toggle when the search parameter view is equal to table", () => {
    jest.spyOn(searchParams, "get").mockReturnValue(ViewToggle.table);

    render(<FilterBar />);

    expect(screen.getByRole("button", { name: "Table view" })).toHaveAttribute(
      "aria-pressed",
    );
  });
});
