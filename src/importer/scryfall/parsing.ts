import { Language, Rarity } from "@database/generated/browser";
import { CardData } from "@importer/collection";
import { ScryfallCard, ScryfallLayout } from "@scryfall/api-types";
import assert from "assert";

export const WITHOUT_CARD_FACES: ScryfallLayout[] = [
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

export const WITH_CARD_FACES: ScryfallLayout[] = [
  ScryfallLayout.Transform,
  ScryfallLayout.ModalDfc,
  ScryfallLayout.DoubleFacedToken,
  ScryfallLayout.ArtSeries,
  ScryfallLayout.ReversibleCard,
];

function getCardImageUris(card: ScryfallCard.Any): {
  small: string;
  normal: string;
  large: string;
} {
  if (WITHOUT_CARD_FACES.includes(card.layout as ScryfallLayout)) {
    const singleFaced = card as ScryfallCard.AnySingleFaced;

    assert(
      singleFaced.image_uris !== undefined,
      `No image found for card: ${card.name} (${card.set}/${card.collector_number})`,
    );

    return singleFaced.image_uris;
  }

  if (WITH_CARD_FACES.includes(card.layout as ScryfallLayout)) {
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

function getFlavorText(card: ScryfallCard.Any): string | null {
  if ("flavor_text" in card === false) {
    return null;
  }

  return card.flavor_text ?? null;
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

function getTypeLine(card: ScryfallCard.Any): string {
  assert(
    "type_line" in card,
    `No type_line found for card: ${card.name} (${card.set}/${card.collector_number})`,
  );

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

export function toCardData(card: ScryfallCard.Any): CardData {
  const imageUris = getCardImageUris(card);
  const oracleId = getOracleId(card);
  const oracleText = getOracleText(card);
  const flavorText = getFlavorText(card);
  const typeLine = getTypeLine(card);
  const printedName = getPrintedName(card);
  const printedTypeLine = getPrintedTypeLine(card);
  const printedText = getPrintedText(card);
  const cardFaces = getCardFaces(card);
  const cmc = getCmc(card);

  return {
    scryfallId: card.id,
    scryfallUri: card.scryfall_uri,
    oracleId,
    name: card.name,
    printedName,
    setCode: card.set,
    setName: card.set_name,
    collectorNumber: card.collector_number,
    language: card.lang.toUpperCase() as Language,
    rarity: card.rarity.toUpperCase() as Rarity,
    typeLine,
    printedTypeLine,
    imageUrlSmall: imageUris?.small ?? null,
    imageUrlNormal: imageUris?.normal ?? null,
    imageUrlLarge: imageUris?.large ?? null,
    oracleText,
    flavorText,
    printedText,
    artist: card.artist ?? null,
    manaCost: card.mana_cost ?? null,
    cmc,
    colorIdentity: card.color_identity,
    layout: card.layout,
    cardFaces: cardFaces,
  };
}
