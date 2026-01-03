import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { ExampleComponent } from "./ExampleComponent";

describe("ExampleComponent", () => {
  it("renders the message", () => {
    render(<ExampleComponent message="Hello, World!" />);

    expect(screen.getByTestId("example")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Example",
    );
    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });
});
