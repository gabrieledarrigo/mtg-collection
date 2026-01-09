import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Navigation from "./Navigation";
import * as navigation from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Navigation", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/collection" },
  ];

  beforeEach(() => {
    jest.spyOn(navigation, "usePathname").mockReturnValue("/");
  });

  it("renders navigation items", () => {
    render(<Navigation items={items} />);

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Collection" }),
    ).toBeInTheDocument();
  });

  it("renders links with correct href", () => {
    render(<Navigation items={items} />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Collection" })).toHaveAttribute(
      "href",
      "/collection",
    );
  });

  it("marks the active link based on current pathname", () => {
    jest.spyOn(navigation, "usePathname").mockReturnValue("/collection");

    render(<Navigation items={items} />);

    const collectionLink = screen.getByRole("link", { name: "Collection" });
    expect(collectionLink.className).toContain("active");
  });

  it("marks parent route as active for nested paths", () => {
    jest.spyOn(navigation, "usePathname").mockReturnValue("/collection/123");

    render(<Navigation items={items} />);

    const collectionLink = screen.getByRole("link", { name: "Collection" });
    expect(collectionLink.className).toContain("active");
  });
});
