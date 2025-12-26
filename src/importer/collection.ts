import {
  Card,
  Rarity,
  CollectionItem,
  Language,
  Condition,
  Purchase,
  Source,
  Prisma,
} from "@database/index";

export type CardData = {
  scryfallId: string;
  scryfallUri: string;
  oracleId: string | null;
  name: string;
  printedName: string | null;
  setCode: string;
  setName: string;
  collectorNumber: string;
  language: Language;
  rarity: Rarity;
  typeLine: string | null;
  printedTypeLine: string | null;
  imageUrlSmall: string;
  imageUrlNormal: string;
  imageUrlLarge: string;
  oracleText: string | null;
  flavorText: string | null;
  printedText: string | null;
  artist: string | null;
  manaCost: string | null;
  cmc: number;
  colorIdentity: string[];
  layout: string;
  cardFaces: string | null;
};

export async function upsertCard(
  data: CardData,
  transaction: Prisma.TransactionClient,
): Promise<Card> {
  const upserted = await transaction.card.upsert({
    where: {
      scryfallId: data.scryfallId,
    },
    update: {},
    create: {
      scryfallId: data.scryfallId,
      scryfallUri: data.scryfallUri,
      oracleId: data.oracleId,
      name: data.name,
      printedName: data.printedName,
      setCode: data.setCode,
      setName: data.setName,
      collectorNumber: data.collectorNumber,
      language: data.language,
      rarity: data.rarity,
      typeLine: data.typeLine,
      printedTypeLine: data.printedTypeLine,
      imageUrlSmall: data.imageUrlSmall,
      imageUrlNormal: data.imageUrlNormal,
      imageUrlLarge: data.imageUrlLarge,
      oracleText: data.oracleText,
      flavorText: data.flavorText,
      printedText: data.printedText,
      artist: data.artist,
      manaCost: data.manaCost,
      cmc: data.cmc,
      colorIdentity: data.colorIdentity,
      layout: data.layout,
      cardFaces: data.cardFaces ?? Prisma.JsonNull,
    },
  });

  return upserted;
}

export async function upsertCollectionItem(
  card: Card,
  data: {
    userId: string;
    foil: boolean;
    condition: Condition;
    quantity: number;
  },
  transaction: Prisma.TransactionClient,
): Promise<CollectionItem> {
  const cardId = card.id;
  const { userId, foil, condition, quantity } = data;

  const collectionItem = await transaction.collectionItem.upsert({
    where: {
      unique_collection_item: {
        userId,
        cardId,
        foil,
        condition,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      userId,
      cardId,
      foil,
      condition,
      quantity,
    },
  });

  return collectionItem;
}

export async function createPurchase(
  collectionItem: CollectionItem,
  data: {
    orderId: string;
    quantity: number;
    price: number;
    source: Source;
  },
  transaction: Prisma.TransactionClient,
): Promise<Purchase> {
  const { id: collectionItemId } = collectionItem;
  const { orderId: sourceOrderId, quantity, price, source } = data;

  const purchase = await transaction.purchase.create({
    data: {
      collectionItemId,
      quantity,
      price,
      source,
      sourceOrderId,
      purchasedAt: new Date(),
    },
  });

  return purchase;
}
