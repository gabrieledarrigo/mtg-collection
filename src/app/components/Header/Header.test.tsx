import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the title", () => {
    render(<Header title="MTG Collection" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "MTG Collection" }),
    ).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(
      <Header title="MTG Collection">
        <span data-testid="child">Child content</span>
      </Header>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders inside a header element", () => {
    render(<Header title="MTG Collection" />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
