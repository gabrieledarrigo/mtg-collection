import {
  CardWhereInput,
  CollectionItemOrderByWithRelationInput,
  CollectionItemWhereInput,
  CollectionItemWithCard,
  Condition,
  Language,
  prisma,
  Rarity,
  StringFilter,
} from "@database/index";
import { Page, Pagination } from "./pagination";
import { Color, SortCriteria, SortDirection } from "./types";

export type CollectionItemsFilter = {
  search?: string;
  setCodes?: string[];
  colors?: Color[];
  rarity?: Rarity;
  language?: Language;
  condition?: Condition;
  foil?: boolean;
};

export type AvailableSets = {
  setCode: string;
  setName: string;
}[];

/**
 * Retrieves a paginated list of collection items with their associated card and purchase data.
 * Supports sorting and pagination.
 *
 * @param filters - The optional parameters to filter the results.
 * @param sort - The optional sort criteria,
 * @param pagination - The pagination parameters (page, size, skip). Defaults to Pagination.default().
 * @returns A Promise resolving to a Page containing the collection items, total count, and current page number.
 */
export async function getCollectionItems(
  filters: CollectionItemsFilter = {},
  sort: SortCriteria = {},
  pagination: Pagination = Pagination.default(),
): Promise<Page<CollectionItemWithCard>> {
  const { page, size, skip } = pagination;
  const { search, setCodes, colors, rarity, language, condition, foil } =
    filters;

  const where: CollectionItemWhereInput = {};
  const cardWhere: CardWhereInput = {};
  const containsFilter: StringFilter<"Card"> = {
    contains: search,
    mode: "insensitive",
  };
  const orderBy: CollectionItemOrderByWithRelationInput[] = [];

  if (search) {
    cardWhere.OR = [
      {
        name: containsFilter,
      },
      {
        printedName: containsFilter,
      },
      {
        oracleText: containsFilter,
      },
      {
        printedText: containsFilter,
      },
    ];
  }

  if (setCodes && setCodes.length > 0) {
    cardWhere.setCode = {
      in: setCodes,
    };
  }

  if (colors && colors.length > 0) {
    cardWhere.colorIdentity = {
      hasSome: colors,
    };
  }

  if (rarity) {
    cardWhere.rarity = {
      equals: rarity,
    };
  }

  if (language) {
    cardWhere.language = {
      equals: language,
    };
  }

  if (condition) {
    where.condition = {
      equals: condition,
    };
  }

  if (foil !== undefined) {
    where.foil = {
      equals: foil,
    };
  }

  if (Object.keys(cardWhere).length > 0) {
    where.card = cardWhere;
  }

  if (sort.quantity) {
    orderBy.push({
      quantity: sort.quantity,
    });
  }

  if (sort.name) {
    orderBy.push({
      card: {
        name: sort.name,
      },
    });
  }

  orderBy.push({
    createdAt: SortDirection.DESC,
  });

  const [totalItems, items] = await prisma.$transaction([
    prisma.collectionItem.count({ where }),
    prisma.collectionItem.findMany({
      where,
      take: size,
      skip,
      include: {
        card: true,
        purchases: true,
      },
      orderBy,
    }),
  ]);

  return {
    items,
    page,
    size,
    totalItems,
  };
}

/**
 * Retrieves all available Magic: The Gathering sets that contain at least one card in the collection.
 *
 * @returns A Promise resolving to an AvailableSets array containing set codes and set names, ordered alphabetically by set name.
 */
export async function getAvailableSets(): Promise<AvailableSets> {
  return prisma.card.findMany({
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
}
