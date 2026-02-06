import { CollectionItemGetPayload, prisma } from "@database/index";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;

export type Pagination = {
  page: number;
  size: number;
};

export type Page<T> = {
  items: T[];
  page: number;
  totalItems: number;
};

export type CollectionItemWithRelations = CollectionItemGetPayload<{
  include: {
    card: true;
    purchases: true;
  };
}>;

export async function getCollectionItems(
  pagination: Pagination = {
    page: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
  },
): Promise<Page<CollectionItemWithRelations>> {
  const { page, size } = pagination;

  const skip = (page - 1) * size;
  const count = await prisma.collectionItem.count();
  const collectionItems = await prisma.collectionItem.findMany({
    take: size,
    skip,
    include: {
      card: true,
      purchases: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    items: collectionItems,
    totalItems: count,
    page,
  };
}
