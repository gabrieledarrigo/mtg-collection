import { describe, it, expect, jest } from "@jest/globals";
import type { ScryfallCard, ScryfallList } from "@scryfall/api-types";
import { bySetAndNumber, search, type SearchParams } from "./scryfall";
import { Language } from "../prisma/enums";

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("scryfall", () => {
  describe("bySetAndNumber", () => {
    it("should fetch a card successfully", async () => {
      const card: ScryfallCard.Any = {
        id: "123",
        name: "Test Card",
      } as ScryfallCard.Any;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => card,
      } as Response);

      const result = await bySetAndNumber("khm", 123, Language.EN);

      expect(fetch).toHaveBeenCalledWith(
        "https://api.scryfall.com/cards/khm/123/en",
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "mtg-collection/1.0",
          },
        },
      );
      expect(result).toEqual(card);
    });

    it("should throw error when fetch fails", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      await expect(
        bySetAndNumber("khm", 999, "en" as Language),
      ).rejects.toThrow(
        "Failed to fetch card with data: khm, 999, en. 404 Not Found",
      );
    });
  });

  describe("search", () => {
    it("should search for cards successfully", async () => {
      const list: ScryfallList.Cards = {
        data: [],
        has_more: false,
      } as unknown as ScryfallList.Cards;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => list,
      } as Response);

      const params: SearchParams = {
        name: "Lightning Bolt",
        language: Language.EN,
      };
      const result = await search(params);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.scryfall.com/cards/search?q=Lightning+Bolt%2Blanguage%3Aen",
        ),
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "mtg-collection/1.0",
          },
        },
      );
      expect(result).toEqual(list);
    });

    it("should throw error when search fails", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      const params: SearchParams = {
        name: "Invalid Card",
        language: Language.EN,
      };

      await expect(search(params)).rejects.toThrow(
        'Failed to search for card "Invalid Card": 500 Internal Server Error',
      );
    });
  });
});
