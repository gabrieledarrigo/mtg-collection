import { describe, it, jest, expect } from "@jest/globals";
import {
  CollectionItemWithCard,
  DEFAULT_PAGE_SIZE,
  getCollectionItems,
  Pagination,
} from "./collection";
import { prisma } from "@database/index";
import { createMock } from "@test/helpers";

jest.mock("@database/index", () => ({
  prisma: {
    collectionItem: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("collection", () => {
  const count = 100;
  const collectionItem = createMock<CollectionItemWithCard>({
    id: "collection-item-1",
    card: {
      id: "card-id-1",
    },
    purchases: [],
  });

  describe("getCollectionItems", () => {
    it("should query and paginate collection items with the given pagination parameters", async () => {
      const pagination: Pagination = {
        page: 2,
        size: 30,
      };

      await getCollectionItems(pagination);

      expect(prisma.collectionItem.count).toHaveBeenCalled();
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith({
        skip: 30,
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

      expect(prisma.collectionItem.count).toHaveBeenCalled();
      expect(prisma.collectionItem.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: DEFAULT_PAGE_SIZE,
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
      jest.spyOn(prisma.collectionItem, "count").mockResolvedValue(count);
      jest
        .spyOn(prisma.collectionItem, "findMany")
        .mockResolvedValue([collectionItem]);

      const actual = await getCollectionItems();

      expect(actual).toEqual({
        items: [collectionItem],
        totalItems: count,
        page: 1,
      });
    });
  });
});
