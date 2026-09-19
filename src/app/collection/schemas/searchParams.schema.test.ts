import { describe, it, expect } from "@jest/globals";
import {
  collectionSearchParams,
  transformSortParam,
} from "./searchParams.schema";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@app/lib/pagination";
import { ViewToggle, Color, SortDirection } from "@app/lib/types";
import { Rarity, Language, Condition } from "@database/models";
import { SearchParams } from "@importer/scryfall";

describe("collectionSearchParams", () => {
  describe("transformSortParam", () => {
    it.each([
      ["name.asc", { name: "asc" }],
      ["name.desc", { name: "desc" }],
      ["quantity.asc", { quantity: "asc" }],
      ["quantity.desc", { quantity: "desc" }],
    ])(
      "should transform a string in the %s format into an object",
      (str, expected) => {
        const actual = transformSortParam(str);

        expect(actual).toEqual(expected);
      },
    );

    it.each([["color.asc"], ["mana.desc"]])(
      "should not transform unsupported fields",
      (str) => {
        const actual = transformSortParam(str);

        expect(actual).toEqual(undefined);
      },
    );

    it.each(["field.", "field", "fieldasc", ".asc", "asc"])(
      "should not transform malformed string: %s",
      (str) => {
        const actual = transformSortParam(str);

        expect(actual).toEqual(undefined);
      },
    );
  });

  describe("parse", () => {
    it("should fall back to the defaults when no param is given", () => {
      expect(collectionSearchParams.parse({})).toEqual({
        page: DEFAULT_PAGE,
        size: DEFAULT_PAGE_SIZE,
        view: ViewToggle.GRID,
      });
    });

    it("should parse a fully populated query string", () => {
      const actual = collectionSearchParams.parse({
        page: "2",
        size: "10",
        view: ViewToggle.TABLE,
        search: "bolt",
        setCode: ["lea", "leb"],
        color: [Color.R, Color.U],
        rarity: Rarity.MYTHIC,
        language: Language.IT,
        condition: Condition.NEAR_MINT,
        foil: "true",
        sort: "name.asc",
      });

      expect(actual).toEqual({
        page: 2,
        size: 10,
        view: ViewToggle.TABLE,
        search: "bolt",
        setCode: ["lea", "leb"],
        color: [Color.R, Color.U],
        rarity: Rarity.MYTHIC,
        language: Language.IT,
        condition: Condition.NEAR_MINT,
        foil: true,
        sort: { name: SortDirection.ASC },
      });
    });

    describe("pagination", () => {
      it.each([
        ["a numeric string", "3", 3],
        ["a non numeric string", "abc", DEFAULT_PAGE],
        ["a decimal", "1.5", DEFAULT_PAGE],
        ["zero", "0", DEFAULT_PAGE],
        ["a negative number", "-1", DEFAULT_PAGE],
        ["a repeated param", ["1", "2"], DEFAULT_PAGE],
      ])("should parse %s as page", (_, page, expected) => {
        expect(collectionSearchParams.parse({ page }).page).toBe(expected);
      });
    });

    describe("repeatable params", () => {
      it.each([
        ["a single value", Color.R, [Color.R]],
        ["many values", [Color.R, Color.U], [Color.R, Color.U]],
        ["an unsupported color", "Z", undefined],
        ["one unsupported color among many", [Color.R, "Z"], undefined],
      ])("should parse %s into an array of colors", (_, color, expected) => {
        expect(collectionSearchParams.parse({ color }).color).toEqual(expected);
      });
    });

    describe("sort", () => {
      it.each([
        ["a supported field", "name.asc", { name: SortDirection.ASC }],
        [
          "many fields",
          ["name.asc", "quantity.desc"],
          { name: SortDirection.ASC, quantity: SortDirection.DESC },
        ],
        [
          "the same field twice",
          ["name.asc", "name.desc"],
          { name: SortDirection.DESC },
        ],
        ["an unsupported field", "price.asc", {}],
        ["an unsupported direction", "name.up", {}],
        [
          "one unsupported field among many",
          ["name.asc", "price.asc"],
          { name: SortDirection.ASC },
        ],
      ])("should parse %s into sort criteria", (_, sort, expected) => {
        expect(collectionSearchParams.parse({ sort }).sort).toEqual(expected);
      });
    });

    describe("resilience", () => {
      it.each([
        "page",
        "size",
        "view",
        "search",
        "setCode",
        "color",
        "rarity",
        "language",
        "condition",
        "foil",
        "sort",
      ])("should never throw on a junk %s", (param) => {
        const cases = [
          { [param]: "junk" },
          { [param]: ["junk", "junk"] },
          { [param]: null },
          { [param]: "" },
        ] as unknown as SearchParams[];

        cases.forEach((searchParams) => {
          expect(() =>
            collectionSearchParams.parse(searchParams),
          ).not.toThrow();
        });
      });
    });
  });
});
