import { describe, it, expect } from "@jest/globals";
import { Condition, Language } from "@database/prisma";
import {
  toSnakeCase,
  normalizeLanguage,
  normalizeCondition,
  normalizeBoolean,
  normalizeCollectorNumber,
  normalizeOrderItem,
  OrderItemRaw,
  aggregateOrderItems,
  OrderItem,
} from "./cardtrader";

describe("cardtrader", () => {
  describe("toSnakeCase", () => {
    it("should convert spaces to underscores", () => {
      expect(toSnakeCase("Hello World")).toBe("hello_world");
    });

    it("should handle multiple spaces", () => {
      expect(toSnakeCase("Slightly  Played")).toBe("slightly_played");
    });

    it("should trim whitespace", () => {
      expect(toSnakeCase("  Near Mint  ")).toBe("near_mint");
    });

    it("should convert to lowercase", () => {
      expect(toSnakeCase("MINT")).toBe("mint");
    });
  });

  describe("normalizeLanguage", () => {
    it("should map English language", () => {
      expect(normalizeLanguage("en")).toBe(Language.EN);
    });

    it("should map all supported languages", () => {
      expect(normalizeLanguage("fr")).toBe(Language.FR);
      expect(normalizeLanguage("de")).toBe(Language.DE);
      expect(normalizeLanguage("it")).toBe(Language.IT);
      expect(normalizeLanguage("jp")).toBe(Language.JA);
      expect(normalizeLanguage("kr")).toBe(Language.KO);
      expect(normalizeLanguage("pt")).toBe(Language.PT);
      expect(normalizeLanguage("ru")).toBe(Language.RU);
      expect(normalizeLanguage("es")).toBe(Language.ES);
      expect(normalizeLanguage("zh-CN")).toBe(Language.ZHS);
      expect(normalizeLanguage("zh-TW")).toBe(Language.ZHT);
    });

    it("should be case insensitive", () => {
      expect(normalizeLanguage("EN")).toBe(Language.EN);
    });

    it("should throw an error for unknown language", () => {
      expect(() => normalizeLanguage("unknown")).toThrow(
        "Unknown language: unknown",
      );
    });
  });

  describe("normalizeCondition", () => {
    it("should map all conditions", () => {
      expect(normalizeCondition("Mint")).toBe(Condition.MINT);
      expect(normalizeCondition("Near Mint")).toBe(Condition.NEAR_MINT);
      expect(normalizeCondition("Slightly Played")).toBe(Condition.EXCELLENT);
      expect(normalizeCondition("Moderately Played")).toBe(Condition.GOOD);
      expect(normalizeCondition("Played")).toBe(Condition.LIGHT_PLAYED);
      expect(normalizeCondition("Poor")).toBe(Condition.POOR);
    });

    it("should throw an error for unknown condition", () => {
      expect(() => normalizeCondition("Unknown")).toThrow(
        "Unknown condition: Unknown",
      );
    });
  });

  describe("normalizeBoolean", () => {
    it("should return true for 'true'", () => {
      expect(normalizeBoolean("true")).toBe(true);
    });

    it("should return true for 'TRUE'", () => {
      expect(normalizeBoolean("TRUE")).toBe(true);
    });

    it("should return false for 'false'", () => {
      expect(normalizeBoolean("false")).toBe(false);
    });

    it("should return false for other values", () => {
      expect(normalizeBoolean("anything")).toBe(false);
    });
  });

  describe("normalizeCollectorNumber", () => {
    it("should parse simple numbers", () => {
      expect(normalizeCollectorNumber("123")).toBe("123");
    });

    it("should remove leading zeros", () => {
      expect(normalizeCollectorNumber("007")).toBe("7");
    });

    it("should remove 't' prefix", () => {
      expect(normalizeCollectorNumber("t123")).toBe("123");
    });

    it("should remove fraction prefix", () => {
      expect(normalizeCollectorNumber("123/456")).toBe("456");
    });

    it("should handle spaces", () => {
      expect(normalizeCollectorNumber("1 2 3")).toBe("123");
    });

    it("should handle complex cases", () => {
      expect(normalizeCollectorNumber("T 001/456")).toBe("456");
    });
  });

  describe("normalizeOrderItem", () => {
    it("should normalize all fields", () => {
      const raw: OrderItemRaw = {
        game: "mtg",
        setReleasedAt: "2023-01-01",
        setName: "Test Set",
        setCode: "TST",
        itemName: "Test Card",
        priceInEurCents: "100",
        quantity: "2",
        condition: "Near Mint",
        language: "en",
        foilReverse: "true",
        signed: "false",
        altered: "TRUE",
        firstEdition: "yes",
        collectorNumber: "123",
      };

      const result = normalizeOrderItem(raw);

      expect(result.setCode).toBe("tst");
      expect(result.priceInEurCents).toBe(100);
      expect(result.quantity).toBe(2);
      expect(result.condition).toBe(Condition.NEAR_MINT);
      expect(result.language).toBe(Language.EN);
      expect(result.foilReverse).toBe(true);
      expect(result.signed).toBe(false);
      expect(result.altered).toBe(true);
      expect(result.collectorNumber).toBe("123");
    });
  });

  describe("aggregateOrderItems", () => {
    it("should aggregate order items with the same key", () => {
      const items: OrderItem[] = [
        {
          game: "mtg",
          setReleasedAt: "2023-01-01",
          setName: "Test Set",
          setCode: "tst",
          itemName: "Test Card",
          priceInEurCents: 100,
          quantity: 2,
          condition: Condition.NEAR_MINT,
          language: Language.EN,
          foilReverse: false,
          signed: false,
          altered: false,
          firstEdition: "no",
          collectorNumber: "123",
        },
        {
          game: "mtg",
          setReleasedAt: "2023-01-01",
          setName: "Test Set",
          setCode: "tst",
          itemName: "Test Card",
          priceInEurCents: 150,
          quantity: 1,
          condition: Condition.NEAR_MINT,
          language: Language.EN,
          foilReverse: false,
          signed: false,
          altered: false,
          firstEdition: "no",
          collectorNumber: "123",
        },
      ];

      const key = "tst_123_EN_false_NEAR_MINT";
      const result = aggregateOrderItems(items);

      expect(result[key]).toBeDefined();
      expect(result[key]!.quantity).toBe(3);
      expect(result[key]!.totalPrice).toBe(250);
      expect(result[key]!.item).toBe(items[0]);
    });

    it("should keep order items with different keys separate", () => {
      const items: OrderItem[] = [
        {
          game: "mtg",
          setReleasedAt: "2023-01-01",
          setName: "Test Set",
          setCode: "tst",
          itemName: "Test Card",
          priceInEurCents: 100,
          quantity: 1,
          condition: Condition.NEAR_MINT,
          language: Language.EN,
          foilReverse: false,
          signed: false,
          altered: false,
          firstEdition: "no",
          collectorNumber: "123",
        },
        {
          game: "mtg",
          setReleasedAt: "2023-01-01",
          setName: "Test Set",
          setCode: "tst",
          itemName: "Test Card",
          priceInEurCents: 150,
          quantity: 2,
          condition: Condition.NEAR_MINT,
          language: Language.FR,
          foilReverse: false,
          signed: false,
          altered: false,
          firstEdition: "no",
          collectorNumber: "123",
        },
      ];

      const keyOne = "tst_123_EN_false_NEAR_MINT";
      const keyTwo = "tst_123_FR_false_NEAR_MINT";
      const result = aggregateOrderItems(items);

      expect(result[keyOne]).toBeDefined();
      expect(result[keyOne]!.quantity).toBe(1);

      expect(result[keyTwo]).toBeDefined();
      expect(result[keyTwo]!.quantity).toBe(2);
    });

    it("should return empty object for an empty array", () => {
      const result = aggregateOrderItems([]);

      expect(result).toEqual({});
    });

    it("should handle a single order item", () => {
      const items = [
        {
          game: "mtg",
          setReleasedAt: "2023-01-01",
          setName: "Test Set",
          setCode: "tst",
          itemName: "Test Card",
          priceInEurCents: 100,
          quantity: 1,
          condition: Condition.NEAR_MINT,
          language: Language.EN,
          foilReverse: false,
          signed: false,
          altered: false,
          firstEdition: "no",
          collectorNumber: "123",
        },
      ];

      const key = "tst_123_EN_false_NEAR_MINT";
      const result = aggregateOrderItems(items);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[key]!.quantity).toBe(1);
      expect(result[key]!.totalPrice).toBe(100);
    });
  });
});
