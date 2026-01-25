import { describe, it, expect, jest } from "@jest/globals";
import type { ScryfallCard, ScryfallList } from "@scryfall/api-types";
import { bySetAndNumber, search, type SearchParams } from "./client";
import { Language } from "@database/index";
import { createMock } from "@test/helpers";

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("scryfall", () => {
  describe("bySetAndNumber", () => {
    it("should fetch a card successfully", async () => {
      const card = createMock<ScryfallCard.Any>({
        id: "123",
        name: "Test Card",
      });

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(card),
      } as Response);

      const actual = await bySetAndNumber("khm", "123", Language.EN);

      expect(fetch).toHaveBeenCalledWith(
        "https://api.scryfall.com/cards/khm/123/en",
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "mtg-collection/1.0",
          },
        },
      );
      expect(actual).toEqual(card);
    });

    it("should throw error when fetch fails", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      await expect(
        bySetAndNumber("khm", "999", "en" as Language),
      ).rejects.toThrow(
        "Failed to fetch card with data: khm, 999, en. 404 Not Found",
      );
    });
  });

  describe("search", () => {
    it("should search for cards successfully", async () => {
      const list = createMock<ScryfallList.Cards>({
        data: [],
        has_more: false,
      });

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(list),
      } as Response);

      const params: SearchParams = {
        name: "Lightning Bolt",
        language: Language.EN,
      };

      const actual = await search(params);

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
      expect(actual).toEqual(list);
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
