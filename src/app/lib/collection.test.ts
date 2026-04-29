import { describe, beforeEach, it, jest, expect } from "@jest/globals";
import {
  CollectionItemWhereInput,
  CollectionItemWithCard,
  Condition,
  Language,
  prisma,
  Rarity,
} from "@database/index";
import { createMock } from "@test/helpers";
import {
  AvailableSets,
  getAvailableSets,
  getCollectionItems,
} from "./collection";
import { Pagination } from "./pagination";
import { Color } from "./types";

jest.mock("@database/index", () => ({
  ...(jest.requireActual("@database/index") as object),
  prisma: {
    $transaction: jest.fn(),
    collectionItem: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    card: {
      findMany: jest.fn(),
    },
  },
}));

describe("collection", () => {
  describe("getCollectionItems", () => {
    const count = 100;
    const collectionItem = createMock<CollectionItemWithCard>({
      id: "collection-item-1",
      card: {
        id: "card-id-1",
        name: "Card 1",
        setName: "Set",
        setCode: "set",
        collectorNumber: "1",
        language: Language.IT,
      },
      quantity: 12,
      condition: Condition.MINT,
      foil: true,
      purchases: [
        {
          price: 1250,
        },
        {
          price: 1370,
        },
      ],
    });

    beforeEach(() => {
      jest
        .spyOn(prisma, "$transaction")
        .mockResolvedValue([count, [collectionItem]]);
    });

    it("should query collection items with the given search filter", async () => {
      const search = "Brainstorm";

      await getCollectionItems({
        search,
      });

      const where: CollectionItemWhereInput = {
        card: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              printedName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              oracleText: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              printedText: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      };

      expect(prisma.collectionItem.count).toHaveBeenCalledWith({
        where,
      });
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where,
        }),
      );
    });

    it("should query collection items with the given set code filter", async () => {
      const setCode = "drk";

      await getCollectionItems({
        setCode,
      });

      const where: CollectionItemWhereInput = {
        card: {
          setCode: {
            equals: setCode,
          },
        },
      };

      expect(prisma.collectionItem.count).toHaveBeenCalledWith({
        where,
      });
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where,
        }),
      );
    });

    it("should query collection items with the given colors filter", async () => {
      const colors: Color[] = [Color.U, Color.B];

      await getCollectionItems({
        colors,
      });

      const where: CollectionItemWhereInput = {
        card: {
          colorIdentity: {
            hasSome: colors,
          },
        },
      };

      expect(prisma.collectionItem.count).toHaveBeenCalledWith({
        where,
      });
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where,
        }),
      );
    });

    it("should query collection items with the given rarity filter", async () => {
      const rarity = Rarity.COMMON;

      await getCollectionItems({
        rarity,
      });

      const where: CollectionItemWhereInput = {
        card: {
          rarity: {
            equals: rarity,
          },
        },
      };

      expect(prisma.collectionItem.count).toHaveBeenCalledWith({
        where,
      });
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where,
        }),
      );
    });

    it("should query collection items with the given language filter", async () => {
      const language = Language.EN;

      await getCollectionItems({
        language,
      });

      const where: CollectionItemWhereInput = {
        card: {
          language: {
            equals: language,
          },
        },
      };

      expect(prisma.collectionItem.count).toHaveBeenCalledWith({
        where,
      });
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where,
        }),
      );
    });

    it("should query collection items with the given condition filter", async () => {
      const condition = Condition.NEAR_MINT;

      await getCollectionItems({
        condition,
      });

      const where: CollectionItemWhereInput = {
        condition: {
          equals: condition,
        },
      };

      expect(prisma.collectionItem.count).toHaveBeenCalledWith({
        where,
      });
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where,
        }),
      );
    });

    it("should query collection items with the given foil filter", async () => {
      const foil = true;

      await getCollectionItems({
        foil,
      });

      const where: CollectionItemWhereInput = {
        foil: {
          equals: foil,
        },
      };

      expect(prisma.collectionItem.count).toHaveBeenCalledWith({
        where,
      });
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where,
        }),
      );
    });

    it("should query and paginate collection items with the given pagination parameters", async () => {
      const pagination = createMock<Pagination>({
        page: 2,
        size: 20,
        skip: 30,
      });

      await getCollectionItems({}, pagination);

      expect(prisma.collectionItem.count).toHaveBeenCalled();
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith({
        where: {},
        skip: pagination.skip,
        take: pagination.size,
        include: {
          card: true,
          purchases: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should query and paginate collection items using the default pagination parameters", async () => {
      await getCollectionItems();

      const expected = Pagination.default();

      expect(prisma.collectionItem.count).toHaveBeenCalled();
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith({
        where: {},
        skip: expected.skip,
        take: expected.size,
        include: {
          card: true,
          purchases: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should return a Page of collection items", async () => {
      const actual = await getCollectionItems();

      expect(actual).toEqual({
        items: [collectionItem],
        totalItems: count,
        page: 1,
        size: 48,
      });
    });
  });

  describe("getAvailableSets", () => {
    const availableSets: AvailableSets = [
      {
        setName: "Mercadian Masques",
        setCode: "MQM",
      },
    ];

    beforeEach(() => {
      jest
        .spyOn(prisma.card, "findMany")
        .mockResolvedValue(availableSets as never);
    });

    it("should query and return all available sets in the collection", async () => {
      const actual = await getAvailableSets();

      expect(prisma.card.findMany).toHaveBeenCalledWith({
        distinct: ["setCode", "setName"],
        select: {
          setCode: true,
          setName: true,
        },
        where: {
          collectionItems: {
            some: {},
          },
        },
        orderBy: [{ setName: "asc" }, { setCode: "asc" }],
      });

      expect(actual).toEqual(availableSets);
    });
  });
});
