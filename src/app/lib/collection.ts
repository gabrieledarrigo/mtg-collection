import { CollectionItemGetPayload, prisma } from "@database/index";
import { Page, Pagination } from "./pagination";

export type CollectionItemWithCard = CollectionItemGetPayload<{
  include: {
    card: true;
    purchases: true;
  };
}>;

export async function getCollectionItems(
  pagination: Pagination = Pagination.default(),
): Promise<Page<CollectionItemWithCard>> {
  const { page, size, skip } = pagination;

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
