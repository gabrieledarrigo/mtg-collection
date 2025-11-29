import { ScryfallCard, ScryfallLayout } from "@scryfall/api-types";
import {
  Card,
  Rarity,
  CollectionItem,
  Language,
  Condition,
  Purchase,
  Source,
  Prisma,
} from "../prisma";

function getCardImageUrl(card: ScryfallCard.Any): string | null {
  if (
    card.layout === ScryfallLayout.Normal ||
    card.layout === ScryfallLayout.Leveler ||
    card.layout === ScryfallLayout.Class
  ) {
    return card.image_uris?.normal ?? null;
  }

  if (
    card.layout === ScryfallLayout.Split ||
    card.layout === ScryfallLayout.Flip ||
    card.layout === ScryfallLayout.Adventure
  ) {
    return card.image_uris?.normal ?? null;
  }

  if (
    card.layout === ScryfallLayout.Transform ||
    card.layout === ScryfallLayout.ModalDfc ||
    card.layout === ScryfallLayout.DoubleFacedToken ||
    card.layout === ScryfallLayout.ReversibleCard ||
    card.layout === ScryfallLayout.ArtSeries
  ) {
    if (card.card_faces && card.card_faces.length > 0) {
      return card.card_faces[0]?.image_uris?.normal ?? null;
    }
  }

  return null;
}

function getOracleId(card: ScryfallCard.Any): string | null {
  if ("oracle_id" in card === false) {
    return null;
  }

  return card.oracle_id;
}

function getTypeLine(card: ScryfallCard.Any): string | null {
  if ("type_line" in card === false) {
    return null;
  }

  return card.type_line;
}

function getOracleText(card: ScryfallCard.Any): string | null {
  if ("oracle_text" in card === false) {
    return null;
  }

  return card.oracle_text;
}

function getCardFaces(card: ScryfallCard.Any): string {
  if ("card_faces" in card === false) {
    return "null";
  }

  return JSON.stringify(card.card_faces);
}

function getCmc(card: ScryfallCard.Any): number {
  if ("cmc" in card === false) {
    return 0;
  }

  return card.cmc;
}

export async function upsertCard(
  card: ScryfallCard.Any,
  transaction: Prisma.TransactionClient,
): Promise<Card> {
  const imageUrl = getCardImageUrl(card);
  const oracleId = getOracleId(card);
  const typeLine = getTypeLine(card);
  const oracleText = getOracleText(card);
  const cardFaces = getCardFaces(card);
  const cmc = getCmc(card);

  const upserted = await transaction.card.upsert({
    where: {
      scryfallId: card.id,
    },
    update: {},
    create: {
      scryfallId: card.id,
      oracleId,
      name: card.name,
      setCode: card.set,
      collectorNumber: card.collector_number,
      rarity: card.rarity.toUpperCase() as Rarity,
      typeLine,
      imageUrl,
      oracleText,
      manaCost: card.mana_cost ?? "",
      cmc,
      colorIdentity: card.color_identity,
      layout: card.layout,
      cardFaces,
    },
  });

  return upserted;
}

export async function upsertCollectionItem(
  card: Card,
  data: {
    userId: string;
    language: Language;
    foil: boolean;
    condition: Condition;
    quantity: number;
  },
  transaction: Prisma.TransactionClient,
): Promise<CollectionItem> {
  const cardId = card.id;
  const { userId, language, foil, condition, quantity } = data;

  const collectionItem = await transaction.collectionItem.upsert({
    where: {
      unique_collection_item: {
        userId,
        cardId,
        language,
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
      language,
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
