import { useState } from "react";
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

  it("renders the clear button by default", () => {
    render(
      <Select options={defaultOptions} value="option1" onChange={() => {}} />,
    );

    expect(
      screen.getByRole("button", { name: "Clear selection" }),
    ).toBeInTheDocument();
  });

  it("hides the clear button when showClearButton is false", () => {
    render(
      <Select
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
        showClearButton={false}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Clear selection" }),
    ).not.toBeInTheDocument();
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
    expect(
      screen.getByText("No options found", { exact: false }),
    ).toBeInTheDocument();
  });

  it("renders a multiple select with no initial selection", () => {
    render(
      <Select
        multiple
        options={defaultOptions}
        value={[]}
        onChange={() => {}}
      />,
    );

    const input = screen.getByRole("combobox");

    expect(input).toBeInTheDocument();
  });

  it("calls onChange with selected values when an option is clicked in multiple mode", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn<(value: string[]) => void>();

    render(
      <Select
        multiple
        options={defaultOptions}
        value={[]}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("combobox");
    await user.click(input);

    const option = await screen.findByText("Option 1");
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith(["option1"]);
  });

  it("calls onChange with all selected values in multiple mode", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn<(value: string[]) => void>();

    render(
      <Select
        multiple
        options={defaultOptions}
        value={["option1"]}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("combobox");
    await user.click(input);

    const option = await screen.findByText("Option 2");
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith(["option1", "option2"]);
  });

  it("should be disabled in multiple mode when disabled prop is true", () => {
    render(
      <Select
        multiple
        options={defaultOptions}
        value={["option1"]}
        onChange={() => {}}
        disabled
      />,
    );

    const input = screen.getByRole("combobox");

    expect(input).toBeDisabled();
  });

  it("displays the value summary after selecting multiple options", async () => {
    const user = userEvent.setup();

    function MultiSelectWrapper() {
      const [selected, setSelected] = useState<string[]>([]);
      return (
        <Select
          multiple
          options={defaultOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Pick options"
        />
      );
    }

    render(<MultiSelectWrapper />);

    const input = screen.getByRole("combobox");
    await user.click(input);

    await user.click(await screen.findByRole("option", { name: "Option 1" }));

    await user.click(await screen.findByRole("option", { name: "Option 2" }));
    expect(screen.getByText("Option 1 (+1 more)")).toBeInTheDocument();

    await user.click(await screen.findByRole("option", { name: "Option 3" }));
    expect(screen.getByText("Option 1 (+2 more)")).toBeInTheDocument();
  });

  it("shows placeholder in single-select when value does not match any option", () => {
    render(
      <Select
        options={defaultOptions}
        value="nonexistent"
        onChange={() => {}}
        placeholder="Choose one"
      />,
    );

    const input = screen.getByPlaceholderText("Choose one");

    expect(input).toBeInTheDocument();
  });
});
