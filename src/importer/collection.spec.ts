import { describe, it, expect, jest } from "@jest/globals";
import { ScryfallCard, ScryfallLayout } from "@scryfall/api-types";
import { upsertCard, upsertCollectionItem, createPurchase } from "./collection";
import {
  Language,
  Condition,
  Source,
  Prisma,
  Card,
  CollectionItem,
  Purchase,
} from "../database";
import { createMock } from "../../test/helpers";

describe("collection", () => {
  describe("upsertCard", () => {
    const transaction = createMock<Prisma.TransactionClient>({
      card: {
        upsert: jest.fn(),
      },
    });

    it("should upsert a normal layout card", async () => {
      const scryfallCard = createMock<ScryfallCard.Normal>({
        id: "scryfall-card-123",
        name: "Lightning Bolt",
        printed_name: "Lightning Bolt",
        set: "m21",
        collector_number: "199",
        lang: "en",
        rarity: "common",
        layout: ScryfallLayout.Normal,
        mana_cost: "{R}",
        cmc: 1,
        color_identity: ["R"],
        oracle_id: "oracle-123",
        type_line: "Instant",
        printed_type_line: "Instant",
        printed_text: "Lightning Bolt deals 3 damage to any target.",
        oracle_text: "Deal 3 damage to any target.",
        image_uris: {
          small: "https://example.com/image_small.jpg",
          normal: "https://example.com/image_normal.jpg",
          large: "https://example.com/image_large.jpg",
        },
      });

      const card = createMock<Card>({
        id: "card-123",
        scryfallId: scryfallCard.id,
      });

      jest.spyOn(transaction.card, "upsert").mockResolvedValue(card);

      await upsertCard(scryfallCard, transaction);

      expect(transaction.card.upsert).toHaveBeenCalledWith({
        where: {
          scryfallId: scryfallCard.id,
        },
        update: {},
        create: expect.objectContaining({
          scryfallId: scryfallCard.id,
          oracleId: scryfallCard.oracle_id,
          name: scryfallCard.name,
          setCode: scryfallCard.set,
          collectorNumber: scryfallCard.collector_number,
          language: "EN",
          rarity: "COMMON",
          typeLine: scryfallCard.type_line,
          imageUrlSmall: "https://example.com/image_small.jpg",
          imageUrlNormal: "https://example.com/image_normal.jpg",
          imageUrlLarge: "https://example.com/image_large.jpg",
          oracleText: scryfallCard.oracle_text,
          printedName: scryfallCard.printed_name,
          printedTypeLine: scryfallCard.printed_type_line,
          printedText: scryfallCard.printed_text,
          manaCost: scryfallCard.mana_cost,
          cmc: scryfallCard.cmc,
          colorIdentity: scryfallCard.color_identity,
          layout: scryfallCard.layout,
          cardFaces: Prisma.JsonNull,
        }),
      });
    });

    it("should handle card with card faces", async () => {
      const scryfallCard = createMock<ScryfallCard.Transform>({
        id: "scryfall-card-456",
        name: "Delver of Secrets // Insectile Aberration",
        set: "isd",
        collector_number: "51",
        lang: "en",
        rarity: "common",
        layout: ScryfallLayout.Transform,
        mana_cost: "{U}",
        cmc: 1,
        color_identity: ["U"],
        oracle_id: "oracle-456",
        type_line: "Creature — Human Wizard",
        card_faces: [
          {
            image_uris: {
              small: "https://example.com/front_small.jpg",
              normal: "https://example.com/front_normal.jpg",
              large: "https://example.com/front_large.jpg",
            },
          },
          {
            image_uris: {
              small: "https://example.com/back_small.jpg",
              normal: "https://example.com/back_normal.jpg",
              large: "https://example.com/back_large.jpg",
            },
          },
        ],
      });

      const card = createMock<Card>({
        id: "card-123",
        scryfallId: scryfallCard.id,
      });

      jest.spyOn(transaction.card, "upsert").mockResolvedValue(card);

      await upsertCard(scryfallCard, transaction);

      expect(transaction.card.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            cardFaces: JSON.stringify(scryfallCard.card_faces),
          }),
        }),
      );
    });

    it("should throw an error when the image URLs are missing", async () => {
      const scryfallCard = createMock<ScryfallCard.Any>({
        id: "scryfall-card-789",
        name: "Some Card",
        set: "set1",
        collector_number: "1",
        rarity: "rare",
        layout: ScryfallLayout.Normal,
        cmc: 2,
        color_identity: [],
      });

      const card = createMock<Card>({
        id: "card-123",
        scryfallId: "scryfall-card-789",
      });

      jest.spyOn(transaction.card, "upsert").mockResolvedValue(card);

      await expect(upsertCard(scryfallCard, transaction)).rejects.toThrow(
        "No image found for card: Some Card (set1/1)",
      );
    });

    it("should handle split layout card", async () => {
      const scryfallCard = createMock<ScryfallCard.Split>({
        id: "scryfall-card-split",
        name: "Fire // Ice",
        set: "apc",
        collector_number: "128",
        lang: "en",
        rarity: "uncommon",
        layout: ScryfallLayout.Split,
        mana_cost: "{1}{R} // {1}{U}",
        cmc: 4,
        color_identity: ["R", "U"],
        oracle_id: "oracle-split",
        type_line: "Instant // Instant",
        image_uris: {
          small: "https://example.com/split_small.jpg",
          normal: "https://example.com/split_normal.jpg",
          large: "https://example.com/split_large.jpg",
        },
      });

      const card = createMock<Card>({
        id: "card-split",
        scryfallId: scryfallCard.id,
      });

      jest.spyOn(transaction.card, "upsert").mockResolvedValue(card);

      await upsertCard(scryfallCard, transaction);

      expect(transaction.card.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            imageUrlSmall: "https://example.com/split_small.jpg",
            imageUrlNormal: "https://example.com/split_normal.jpg",
            imageUrlLarge: "https://example.com/split_large.jpg",
          }),
        }),
      );
    });
  });

  describe("upsertCollectionItem", () => {
    const transaction = createMock<Prisma.TransactionClient>({
      collectionItem: {
        upsert: jest.fn(),
      },
    });

    it("should upsert a collection item", async () => {
      const card = createMock<Card>({
        id: "card-1",
      });

      const data = {
        userId: "user-123",
        language: Language.EN,
        foil: false,
        condition: Condition.NEAR_MINT,
        quantity: 4,
      };

      const collectionItem = createMock<CollectionItem>({
        id: "collection-item-123",
      });

      jest
        .spyOn(transaction.collectionItem, "upsert")
        .mockResolvedValue(collectionItem);

      await upsertCollectionItem(card, data, transaction);

      expect(transaction.collectionItem.upsert).toHaveBeenCalledWith({
        where: {
          unique_collection_item: {
            userId: data.userId,
            cardId: card.id,
            foil: data.foil,
            condition: data.condition,
          },
        },
        update: { quantity: { increment: data.quantity } },
        create: {
          userId: data.userId,
          cardId: card.id,
          foil: data.foil,
          condition: data.condition,
          quantity: data.quantity,
        },
      });
    });
  });

  describe("createPurchase", () => {
    const transaction = createMock<Prisma.TransactionClient>({
      purchase: {
        create: jest.fn(),
      },
    });

    it("should create a purchase record", async () => {
      const collectionItem = createMock<CollectionItem>({
        id: "collection-item-1",
      });

      const data = {
        orderId: "order-123",
        quantity: 2,
        price: 9.99,
        source: Source.CARDTRADER,
      };

      const purchase = createMock<Purchase>({
        id: "purchase-123",
      });

      jest.spyOn(transaction.purchase, "create").mockResolvedValue(purchase);

      await createPurchase(collectionItem, data, transaction);

      expect(transaction.purchase.create).toHaveBeenCalledWith({
        data: {
          collectionItemId: collectionItem.id,
          quantity: data.quantity,
          price: data.price,
          source: data.source,
          sourceOrderId: data.orderId,
          purchasedAt: expect.any(Date),
        },
      });
    });
  });
});
