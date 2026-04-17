import { CollectionItemWithCard, prisma } from "@database/index";
import { Page, Pagination } from "./pagination";

/**
 * Retrieves a paginated list of collection items with their associated card and purchase data.
 *
 * @param pagination - The pagination parameters (page, size, skip). Defaults to Pagination.default().
 * @returns A Promise resolving to a Page containing the collection items, total count, and current page number.
 */
export async function getCollectionItems(
  pagination: Pagination = Pagination.default(),
): Promise<Page<CollectionItemWithCard>> {
  const { page, size, skip } = pagination;

  const [totalItems, items] = await prisma.$transaction([
    prisma.collectionItem.count(),
    prisma.collectionItem.findMany({
      take: size,
      skip,
      include: {
        card: true,
        purchases: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    items,
    page,
    size,
    totalItems,
  };
}
