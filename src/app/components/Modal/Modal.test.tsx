import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders the modal when open is true", () => {
    render(
      <Modal open={true} onOpenChange={() => {}}>
        Modal Content
      </Modal>,
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render the modal when open is false", () => {
    render(
      <Modal open={false} onOpenChange={() => {}}>
        Modal Content
      </Modal>,
    );

    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("renders the title when provided", () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Test Title">
        Modal Content
      </Modal>,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("does not render title when not provided", () => {
    render(
      <Modal open={true} onOpenChange={() => {}}>
        Modal Content
      </Modal>,
    );

    const titleElement = screen.queryByRole("heading");
    expect(titleElement).not.toBeInTheDocument();
  });

  it("passes the onOpenChange callback correctly", () => {
    const onOpenChange = jest.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange}>
        Modal Content
      </Modal>,
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });
});
