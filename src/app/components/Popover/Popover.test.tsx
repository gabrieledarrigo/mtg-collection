import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover, PopoverSide } from "./Popover";

describe("Popover", () => {
  it("renders the trigger", () => {
    render(
      <Popover renderTrigger={<button>Open</button>}>Popover content</Popover>,
    );

    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("does not show the content by default", () => {
    render(
      <Popover renderTrigger={<button>Open</button>}>Popover content</Popover>,
    );

    expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
  });

  it("shows the content when the trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Popover renderTrigger={<button>Open</button>}>Popover content</Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });

  it("renders the title when provided", async () => {
    const user = userEvent.setup();

    render(
      <Popover renderTrigger={<button>Open</button>} title="My Title">
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("does not render the title when not provided", async () => {
    const user = userEvent.setup();

    render(
      <Popover renderTrigger={<button>Open</button>}>Popover content</Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.queryByText("My Title")).not.toBeInTheDocument();
  });

  it("renders children inside the popover", async () => {
    const user = userEvent.setup();

    render(
      <Popover renderTrigger={<button>Open</button>}>
        <span>Custom child</span>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByText("Custom child")).toBeInTheDocument();
  });

  it("uses the custom render trigger element", async () => {
    const user = userEvent.setup();

    render(
      <Popover renderTrigger={<button>Custom trigger</button>}>
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Custom trigger" }));

    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });

  it.each([
    PopoverSide.TOP,
    PopoverSide.RIGHT,
    PopoverSide.BOTTOM,
    PopoverSide.LEFT,
  ])("renders with side %s", (side) => {
    render(
      <Popover renderTrigger={<button>Open</button>} side={side}>
        Popover content
      </Popover>,
    );

    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });
});
