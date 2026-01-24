import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Checkbox } from "./Checkbox";
import { IconName } from "../Icon/Icon";

describe("Checkbox", () => {
  it("renders the checkbox", () => {
    render(<Checkbox checked={false} onChange={() => {}} />);

    const checkboxElement = screen.getByRole("checkbox");

    expect(checkboxElement).toBeInTheDocument();
  });

  it("renders the checkbox with a text label", () => {
    render(
      <Checkbox checked={false} onChange={() => {}} label="Accept terms" />,
    );

    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders the checkbox with an icon", () => {
    render(
      <Checkbox checked={false} onChange={() => {}} icon={IconName.FILTER} />,
    );

    expect(screen.getByTestId("icon-filter")).toBeInTheDocument();
  });

  it("renders the checkbox both with an icon and a label", () => {
    render(
      <Checkbox
        checked={false}
        onChange={() => {}}
        icon={IconName.FILTER}
        label="Filter"
      />,
    );

    expect(screen.getByTestId("icon-filter")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("should be checked when checked prop is true", () => {
    render(<Checkbox checked={true} onChange={() => {}} />);

    const checkboxElement = screen.getByRole("checkbox");

    expect(checkboxElement).toBeChecked();
  });

  it("should be unchecked when checked prop is false", () => {
    render(<Checkbox checked={false} onChange={() => {}} />);

    const checkboxElement = screen.getByRole("checkbox");

    expect(checkboxElement).not.toBeChecked();
  });

  it("should call onChange when clicked", () => {
    const onChange = jest.fn();

    render(<Checkbox checked={false} onChange={onChange} />);

    const checkboxElement = screen.getByRole("checkbox");
    checkboxElement.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("should toggle from checked to unchecked", () => {
    const onChange = jest.fn();

    render(<Checkbox checked={true} onChange={onChange} />);

    const checkboxElement = screen.getByRole("checkbox");
    checkboxElement.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("should be required when required prop is true", () => {
    render(<Checkbox checked={false} onChange={() => {}} required />);

    const checkboxElement = screen.getByRole("checkbox");

    expect(checkboxElement).toBeRequired();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Checkbox checked={false} onChange={() => {}} disabled />);

    const checkboxElement = screen.getByRole("checkbox");

    expect(checkboxElement).toHaveAttribute("aria-disabled", "true");
  });

  it("should not call onChange when disabled", () => {
    const onChange = jest.fn();

    render(<Checkbox checked={false} onChange={onChange} disabled />);

    const checkboxElement = screen.getByRole("checkbox");
    checkboxElement.click();

    expect(onChange).not.toHaveBeenCalled();
  });
});
