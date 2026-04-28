import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar, SEARCH_DEBOUNCE_DELAY } from "../FilterBar/FilterBar";
import { Color, ViewToggle } from "@app/lib/types";
import * as navigation from "next/navigation";
import * as hook from "@app/hooks/useUpdateSearchParams";

jest.mock("next/navigation");
jest.mock("@app/hooks/useUpdateSearchParams");

describe("FilterBar", () => {
  const searchParams =
    new URLSearchParams() as navigation.ReadonlyURLSearchParams;

  const setSearchParams = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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

  it("should render a search input", () => {
    render(<FilterBar />);

    const searchInput = screen.getByRole("searchbox");

    expect(searchInput).toBeInTheDocument();
  });

  it("should update the search params with the given user search", async () => {
    const user = userEvent.setup({
      advanceTimers: (ms) => jest.advanceTimersByTime(ms),
    });

    render(<FilterBar />);

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "Brainstorm");

    act(() => {
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_DELAY);
    });

    expect(setSearchParams).toHaveBeenCalledWith({ search: "Brainstorm" });
  });

  it("should render a checkbox for each Color", () => {
    render(<FilterBar />);

    const checkBoxes = screen.getAllByRole("checkbox");

    expect(checkBoxes).toHaveLength(5);

    for (const color of Object.values(Color)) {
      const checkbox = screen.getByRole("checkbox", {
        name: `Filter by ${color}`,
      });

      expect(checkbox).toBeInTheDocument();
    }
  });

  it("should add a color to the search params when a user checks a checkbox", async () => {
    const user = userEvent.setup({
      advanceTimers: (ms) => jest.advanceTimersByTime(ms),
    });

    render(<FilterBar />);

    for (const color of Object.values(Color)) {
      const checkbox = screen.getByRole("checkbox", {
        name: `Filter by ${color}`,
      });

      await user.click(checkbox);

      expect(setSearchParams).toHaveBeenCalledWith({ color: [color] });
    }
  });
});
