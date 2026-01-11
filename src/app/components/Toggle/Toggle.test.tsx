import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Toggle, ToggleOption, ToggleVariant } from "./Toggle";
import { IconName } from "../Icon/Icon";

describe("Toggle", () => {
  const defaultOptions: [ToggleOption<string>, ToggleOption<string>] = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("renders the toggle with text options", () => {
    render(
      <Toggle
        options={defaultOptions}
        value="a"
        variant={ToggleVariant.NEUTRAL}
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Option A" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Option B" }),
    ).toBeInTheDocument();
  });

  it("renders the toggle with icon options", () => {
    render(
      <Toggle
        options={[
          { value: "grid", icon: IconName.GRID, label: "Grid view" },
          { value: "list", icon: IconName.LIST, label: "List view" },
        ]}
        value="grid"
        variant={ToggleVariant.PRIMARY}
        onChange={() => {}}
      />,
    );

    expect(screen.getByTestId("icon-grid")).toBeInTheDocument();
    expect(screen.getByTestId("icon-list")).toBeInTheDocument();
  });

  it.each([ToggleVariant.NEUTRAL, ToggleVariant.PRIMARY])(
    "should render the variant %s",
    (variant) => {
      const { container } = render(
        <Toggle
          options={defaultOptions}
          value="a"
          variant={variant}
          onChange={() => {}}
        />,
      );

      expect(container.firstChild).toHaveClass(`toggle-group--${variant}`);
    },
  );

  it("should mark the selected option as pressed", () => {
    render(
      <Toggle
        options={defaultOptions}
        value="a"
        variant={ToggleVariant.NEUTRAL}
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: "Option A" })).toHaveAttribute(
      "data-pressed",
    );
    expect(
      screen.getByRole("button", { name: "Option B" }),
    ).not.toHaveAttribute("data-pressed");
  });

  it("should call onChange when clicking a different option", () => {
    const onChange = jest.fn();

    render(
      <Toggle
        options={defaultOptions}
        value="a"
        variant={ToggleVariant.NEUTRAL}
        onChange={onChange}
      />,
    );

    screen.getByRole("button", { name: "Option B" }).click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("should not call onChange when clicking the already selected option", () => {
    const onChange = jest.fn();

    render(
      <Toggle
        options={defaultOptions}
        value="a"
        variant={ToggleVariant.NEUTRAL}
        onChange={onChange}
      />,
    );

    screen.getByRole("button", { name: "Option A" }).click();

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should not call onChange when disabled", () => {
    const onChange = jest.fn();
    render(
      <Toggle
        options={defaultOptions}
        value="a"
        variant={ToggleVariant.NEUTRAL}
        onChange={onChange}
        disabled
      />,
    );

    screen.getByRole("button", { name: "Option B" }).click();

    expect(onChange).not.toHaveBeenCalled();
  });
});
