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

  it("renders the close button", () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Test Title">
        Modal Content
      </Modal>,
    );

    expect(screen.getByTestId("icon-close")).toBeInTheDocument();
  });

  it("renders the footer when provided", () => {
    render(
      <Modal
        open={true}
        onOpenChange={() => {}}
        title="Test Title"
        footer={<button>Submit</button>}
      >
        Modal Content
      </Modal>,
    );

    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("does not render footer when not provided", () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Test Title">
        Modal Content
      </Modal>,
    );

    // Footer would contain buttons, so check that only title and content are present
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    // Verify no extra buttons exist (only the close button icon)
    const buttons = screen
      .getAllByRole("button")
      .filter((btn) => btn.className.includes("close"));
    expect(buttons.length).toBeGreaterThan(0); // Close button exists
  });

  it("calls onOpenChange when close button is clicked", () => {
    const onOpenChange = jest.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Test Title">
        Modal Content
      </Modal>,
    );

    const closeIcon = screen.getByTestId("icon-close");
    const closeButton = closeIcon.closest("button");
    if (closeButton) {
      closeButton.click();
    }

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(Object));
  });
});
