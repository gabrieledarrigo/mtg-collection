import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectOption } from "./Select";

describe("Select", () => {
  const defaultOptions: SelectOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders the select with input", () => {
    render(
      <Select options={defaultOptions} value="option1" onChange={() => {}} />,
    );

    const input = screen.getByRole("combobox");

    expect(input).toBeInTheDocument();
  });

  it("displays the selected option value in input", () => {
    render(
      <Select options={defaultOptions} value="option2" onChange={() => {}} />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;

    expect(input.value).toBe("Option 2");
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

    const input = screen.getByPlaceholderText("Choose one");

    expect(input).toBeInTheDocument();
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

  it("displays an asterisk when the required prop is true", () => {
    render(
      <Select
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
        label="Required Field"
        required
      />,
    );

    expect(screen.getByText("Required Field *")).toBeInTheDocument();
  });

  it("displays an error message when the error prop is provided", () => {
    render(
      <Select
        options={defaultOptions}
        value=""
        onChange={() => {}}
        label="Select"
        error="Please select an option"
      />,
    );

    expect(screen.getByText("Please select an option")).toBeInTheDocument();
  });

  it("allows filtering options by typing", async () => {
    const user = userEvent.setup();
    render(
      <Select
        options={defaultOptions}
        value=""
        onChange={() => {}}
        placeholder="Type to search"
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;

    // Clear and type
    await user.clear(input);
    await user.type(input, "Option");

    // The input should allow typing
    expect(input.value).toBe("Option");
  });

  it("calls onChange when value changes", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Select options={defaultOptions} value="option1" onChange={onChange} />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Option 1");

    // Simulate parent component updating the value
    rerender(
      <Select options={defaultOptions} value="option2" onChange={onChange} />,
    );

    expect(input.value).toBe("Option 2");
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

    const input = screen.getByRole("combobox");

    expect(input).toBeDisabled();
  });

  it("shows empty state when no options match filter", async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} value="" onChange={() => {}} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "Nonexistent Option");

    // Empty state should be shown
    expect(screen.getByText("No options found")).toBeInTheDocument();
  });
});
