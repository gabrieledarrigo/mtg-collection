import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Button, ButtonVariant } from "./Button";

describe("Button", () => {
  it("renders the button with correct text", () => {
    render(<Button variant={ButtonVariant.PRIMARY}>Click Me</Button>);

    const buttonElement = screen.getByRole("button", { name: "Click Me" });

    expect(buttonElement).toBeInTheDocument();
  });

  it.each([ButtonVariant.PRIMARY, ButtonVariant.SECONDARY, ButtonVariant.ICON])(
    "should render the variant %s",
    (variant) => {
      render(<Button variant={variant}>Click Me</Button>);

      const buttonElement = screen.getByRole("button", { name: "Click Me" });

      expect(buttonElement).toHaveClass(`button--${variant}`);
    },
  );

  it("should handle onClick events", () => {
    const onClick = jest.fn();
    render(
      <Button variant={ButtonVariant.PRIMARY} onClick={onClick}>
        Click Me
      </Button>,
    );

    const buttonElement = screen.getByRole("button", { name: "Click Me" });
    buttonElement.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click Me</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
