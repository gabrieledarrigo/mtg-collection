import { describe, it, expect } from "@jest/globals";
import { parseViewToggle, ViewToggle } from "./view";

describe("parseViewToggle", () => {
  it.each([null, "an invalid value"])(
    "should return ViewToggle.grid when the given input is",
    (value) => {
      const actual = parseViewToggle(value);

      expect(actual).toEqual(ViewToggle.grid);
    },
  );

  it("should return ViewToggle.grid when the given string is grid", () => {
    const actual = parseViewToggle("grid");

    expect(actual).toEqual(ViewToggle.grid);
  });

  it("should return ViewToggle.table when the given string is table", () => {
    const actual = parseViewToggle("table");

    expect(actual).toEqual(ViewToggle.table);
  });
});
