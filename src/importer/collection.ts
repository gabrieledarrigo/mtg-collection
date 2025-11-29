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
import assert from "node:assert";

function getCardImageUris(card: ScryfallCard.Any): {
  small: string;
  normal: string;
  large: string;
} {
  const withoutCardFaces: ScryfallLayout[] = [
    ScryfallLayout.Normal,
    ScryfallLayout.Meld,
    ScryfallLayout.Leveler,
    ScryfallLayout.Class,
    ScryfallLayout.Saga,
    ScryfallLayout.Mutate,
    ScryfallLayout.Prototype,
    ScryfallLayout.Battle,
    ScryfallLayout.Planar,
    ScryfallLayout.Scheme,
    ScryfallLayout.Vanguard,
    ScryfallLayout.Token,
    ScryfallLayout.Emblem,
    ScryfallLayout.Augment,
    ScryfallLayout.Host,
    ScryfallLayout.Split,
    ScryfallLayout.Flip,
    ScryfallLayout.Adventure,
  ];

  const withCardFaces: ScryfallLayout[] = [
    ScryfallLayout.Transform,
    ScryfallLayout.ModalDfc,
    ScryfallLayout.DoubleFacedToken,
    ScryfallLayout.ArtSeries,
    ScryfallLayout.ReversibleCard,
  ];

  if (withoutCardFaces.includes(card.layout as ScryfallLayout)) {
    const singleFaced = card as ScryfallCard.AnySingleFaced;

    assert(
      singleFaced.image_uris !== undefined,
      `No image found for card: ${card.name} (${card.set}/${card.collector_number})`,
    );

    return singleFaced.image_uris;
  }

  if (withCardFaces.includes(card.layout as ScryfallLayout)) {
    const doubleFaced = card as ScryfallCard.AnyDoubleSidedSplit;

    const frontFaceImageUris = doubleFaced.card_faces?.[0]?.image_uris;

    assert(
      frontFaceImageUris !== undefined,
      `No image found for card: ${card.name} (${card.set}/${card.collector_number})`,
    );

    return frontFaceImageUris;
  }

  throw new Error(
    `No image found for card: ${card.name} (${card.set}/${card.collector_number})`,
  );
}

function getOracleId(card: ScryfallCard.Any): string | null {
  if ("oracle_id" in card === false) {
    return null;
  }

  return card.oracle_id;
}

function getOracleText(card: ScryfallCard.Any): string | null {
  if ("oracle_text" in card === false) {
    return null;
  }

  return card.oracle_text;
}

function getPrintedName(card: ScryfallCard.Any): string | null {
  if ("printed_name" in card === false) {
    return null;
  }

  return card?.printed_name ?? null;
}

function getPrintedText(card: ScryfallCard.Any): string | null {
  if ("printed_text" in card === false) {
    return null;
  }

  return card?.printed_text ?? null;
}

function getPrintedTypeLine(card: ScryfallCard.Any): string | null {
  if ("printed_type_line" in card === false) {
    return null;
  }

  return card?.printed_type_line ?? null;
}

function getTypeLine(card: ScryfallCard.Any): string | null {
  if ("type_line" in card === false) {
    return null;
  }

  return card.type_line;
}

function getCardFaces(card: ScryfallCard.Any): string | null {
  if ("card_faces" in card === false) {
    return null;
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
  const imageUris = getCardImageUris(card);
  const oracleId = getOracleId(card);
  const oracleText = getOracleText(card);
  const typeLine = getTypeLine(card);
  const printedName = getPrintedName(card);
  const printedTypeLine = getPrintedTypeLine(card);
  const printedText = getPrintedText(card);
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
      printedName,
      setCode: card.set,
      collectorNumber: card.collector_number,
      language: card.lang.toUpperCase() as Language,
      rarity: card.rarity.toUpperCase() as Rarity,
      typeLine,
      printedTypeLine,
      imageUrlSmall: imageUris?.small ?? null,
      imageUrlNormal: imageUris?.normal ?? null,
      imageUrlLarge: imageUris?.large ?? null,
      oracleText,
      printedText,
      manaCost: card.mana_cost ?? null,
      cmc,
      colorIdentity: card.color_identity,
      layout: card.layout,
      cardFaces: cardFaces ?? Prisma.JsonNull,
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
