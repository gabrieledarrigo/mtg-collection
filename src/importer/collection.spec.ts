import { describe, it, expect, jest } from "@jest/globals";
import {
  upsertCard,
  upsertCollectionItem,
  createPurchase,
  CardData,
} from "./collection";
import {
  Language,
  Rarity,
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
      const cardData = createMock<CardData>({
        scryfallId: "scryfall-card-123",
        scryfallUri:
          "https://scryfall.com/card/m21/199/lightning-bolt?utm_source=api",
        name: "Lightning Bolt",
        printedName: "Lightning Bolt",
        setCode: "m21",
        setName: "Core Set 2021",
        collectorNumber: "199",
        language: Language.EN,
        rarity: Rarity.COMMON,
        layout: "normal",
        manaCost: "{R}",
        cmc: 1,
        colorIdentity: ["R"],
        oracleId: "oracle-123",
        typeLine: "Instant",
        printedTypeLine: "Instant",
        printedText: "Lightning Bolt deals 3 damage to any target.",
        oracleText: "Deal 3 damage to any target.",
        flavorText: "The spark of life is also the spark of destruction.",
        artist: "Christopher Moeller",
        imageUrlSmall: "https://example.com/image_small.jpg",
        imageUrlNormal: "https://example.com/image_normal.jpg",
        imageUrlLarge: "https://example.com/image_large.jpg",
        cardFaces: null,
      });

      const card = createMock<Card>({
        id: "card-123",
        scryfallId: cardData.scryfallId,
      });

      jest.spyOn(transaction.card, "upsert").mockResolvedValue(card);

      await upsertCard(cardData, transaction);

      expect(transaction.card.upsert).toHaveBeenCalledWith({
        where: {
          scryfallId: cardData.scryfallId,
        },
        update: {},
        create: expect.objectContaining({
          scryfallId: cardData.scryfallId,
          scryfallUri: cardData.scryfallUri,
          oracleId: cardData.oracleId,
          name: cardData.name,
          setCode: cardData.setCode,
          setName: cardData.setName,
          collectorNumber: cardData.collectorNumber,
          language: Language.EN,
          rarity: Rarity.COMMON,
          typeLine: cardData.typeLine,
          imageUrlSmall: "https://example.com/image_small.jpg",
          imageUrlNormal: "https://example.com/image_normal.jpg",
          imageUrlLarge: "https://example.com/image_large.jpg",
          oracleText: cardData.oracleText,
          flavorText: cardData.flavorText,
          artist: cardData.artist,
          printedName: cardData.printedName,
          printedTypeLine: cardData.printedTypeLine,
          printedText: cardData.printedText,
          manaCost: cardData.manaCost,
          cmc: cardData.cmc,
          colorIdentity: cardData.colorIdentity,
          layout: cardData.layout,
          cardFaces: Prisma.JsonNull,
        }),
      });
    });

    it("should handle card with card faces", async () => {
      const cardFaces = JSON.stringify([
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
      ]);

      const cardData = createMock<CardData>({
        scryfallId: "scryfall-card-456",
        scryfallUri: "https://scryfall.com/card/isd/51",
        name: "Delver of Secrets // Insectile Aberration",
        printedName: null,
        setCode: "isd",
        setName: "Innistrad",
        collectorNumber: "51",
        language: Language.EN,
        rarity: Rarity.COMMON,
        layout: "transform",
        manaCost: "{U}",
        cmc: 1,
        colorIdentity: ["U"],
        oracleId: "oracle-456",
        typeLine: "Creature — Human Wizard",
        printedTypeLine: null,
        printedText: null,
        oracleText: null,
        flavorText: null,
        artist: null,
        imageUrlSmall: "https://example.com/front_small.jpg",
        imageUrlNormal: "https://example.com/front_normal.jpg",
        imageUrlLarge: "https://example.com/front_large.jpg",
        cardFaces,
      });

      const card = createMock<Card>({
        id: "card-123",
        scryfallId: cardData.scryfallId,
      });

      jest.spyOn(transaction.card, "upsert").mockResolvedValue(card);

      await upsertCard(cardData, transaction);

      expect(transaction.card.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            cardFaces,
          }),
        }),
      );
    });

    it("should store card with null optional fields", async () => {
      const cardData = createMock<CardData>({
        scryfallId: "scryfall-card-789",
        scryfallUri: "https://scryfall.com/card/set1/1",
        name: "Some Card",
        printedName: null,
        setCode: "set1",
        setName: "Set One",
        collectorNumber: "1",
        language: Language.EN,
        rarity: Rarity.RARE,
        layout: "normal",
        manaCost: null,
        cmc: 2,
        colorIdentity: [],
        oracleId: null,
        typeLine: "Instant // Instant",
        printedTypeLine: null,
        printedText: null,
        oracleText: null,
        flavorText: null,
        artist: null,
        imageUrlSmall: "https://example.com/image_small.jpg",
        imageUrlNormal: "https://example.com/image_normal.jpg",
        imageUrlLarge: "https://example.com/image_large.jpg",
        cardFaces: null,
      });

      const card = createMock<Card>({
        id: "card-123",
        scryfallId: cardData.scryfallId,
      });

      jest.spyOn(transaction.card, "upsert").mockResolvedValue(card);

      const result = await upsertCard(cardData, transaction);

      expect(result).toEqual(card);
      expect(transaction.card.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            oracleId: null,
            printedName: null,
            printedTypeLine: null,
            printedText: null,
            oracleText: null,
            flavorText: null,
            artist: null,
            manaCost: null,
          }),
        }),
      );
    });

    it("should handle split layout card", async () => {
      const cardData = createMock<CardData>({
        scryfallId: "scryfall-card-split",
        scryfallUri: "https://scryfall.com/card/apc/128",
        name: "Fire // Ice",
        printedName: null,
        setCode: "apc",
        setName: "Apocalypse",
        collectorNumber: "128",
        language: Language.EN,
        rarity: Rarity.UNCOMMON,
        layout: "split",
        manaCost: "{1}{R} // {1}{U}",
        cmc: 4,
        colorIdentity: ["R", "U"],
        oracleId: "oracle-split",
        typeLine: "Instant // Instant",
        printedTypeLine: null,
        printedText: null,
        oracleText: null,
        flavorText: null,
        artist: null,
        imageUrlSmall: "https://example.com/split_small.jpg",
        imageUrlNormal: "https://example.com/split_normal.jpg",
        imageUrlLarge: "https://example.com/split_large.jpg",
        cardFaces: null,
      });

      const card = createMock<Card>({
        id: "card-split",
        scryfallId: cardData.scryfallId,
      });

      jest.spyOn(transaction.card, "upsert").mockResolvedValue(card);

      await upsertCard(cardData, transaction);

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
          orderId: data.orderId,
          purchasedAt: expect.any(Date),
        },
      });
    });
  });
});
