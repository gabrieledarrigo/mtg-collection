import { describe, it, expect } from "@jest/globals";
import { Badge, BadgeVariant } from "./Badge";
import { render, screen } from "@testing-library/react";

describe("Badge", () => {
  it.each([
    BadgeVariant.PRIMARY,
    BadgeVariant.SECONDARY,
    BadgeVariant.INFO,
    BadgeVariant.SUCCESS,
    BadgeVariant.DANGER,
    BadgeVariant.WARNING,
  ])("should render with variant %s", (variant) => {
    render(<Badge text="Test Badge" variant={variant} />);

    const badgeElement = screen.getByText("Test Badge");

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass(`badge--${variant}`);
  });

  it("should render the optional title", () => {
    render(<Badge text="Test Badge" title="Test Badge title" />);

    const badgeElement = screen.getByTitle("Test Badge title");

    expect(badgeElement).toBeInTheDocument();
  });
});
