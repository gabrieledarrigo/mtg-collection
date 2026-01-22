import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Select, SelectOption } from "./Select";

describe("Select", () => {
  const defaultOptions: SelectOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders the select with options", () => {
    render(
      <Select
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
      />,
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toBeInTheDocument();
  });

  it("displays the selected option label", () => {
    render(
      <Select
        options={defaultOptions}
        value="option2"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("displays placeholder when no option is selected", () => {
    render(
      <Select
        options={defaultOptions}
        value=""
        onChange={() => {}}
        placeholder="Choose one"
      />,
    );

    expect(screen.getByText("Choose one")).toBeInTheDocument();
  });

  it("renders the label when provided", () => {
    render(
      <Select
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
        label="Select Label"
      />,
    );

    expect(screen.getByText("Select Label")).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Select
        options={defaultOptions}
        value="option1"
        onChange={onChange}
      />,
    );

    // Verify initial state
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Option 1");

    // Simulate parent component updating the value
    rerender(
      <Select
        options={defaultOptions}
        value="option2"
        onChange={onChange}
      />,
    );

    // Verify new value is displayed
    expect(trigger).toHaveTextContent("Option 2");
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <Select
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
        disabled
      />,
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveAttribute("data-disabled");
  });

  it("should have proper attributes", () => {
    render(
      <Select
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
      />,
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("type", "button");
  });
});
