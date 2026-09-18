import { Condition, Language } from "@database/index";

export type OrderItemRaw = {
  game: string;
  setReleasedAt: string;
  setName: string;
  setCode: string;
  itemName: string;
  priceInEurCents: string;
  quantity: string;
  condition: string;
  language: string;
  foilReverse: string;
  signed: string;
  altered: string;
  firstEdition: string;
  collectorNumber: string;
};

export type OrderItem = {
  game: string;
  setReleasedAt: string;
  setName: string;
  setCode: string;
  itemName: string;
  priceInEurCents: number;
  quantity: number;
  condition: Condition;
  language: Language;
  foilReverse: boolean;
  signed: boolean;
  altered: boolean;
  firstEdition: string;
  collectorNumber: string;
  rawItem: OrderItemRaw;
};

export type AggregatedKey =
  `${string}_${string}_${Language}_${boolean}_${Condition}`;

export type AggregatedOrderItems = {
  [key: AggregatedKey]: {
    quantity: number;
    totalPrice: number;
    item: OrderItem;
  };
};

export const LANGUAGE_MAP = {
  en: Language.EN,
  fr: Language.FR,
  de: Language.DE,
  it: Language.IT,
  jp: Language.JA,
  kr: Language.KO,
  pt: Language.PT,
  ru: Language.RU,
  es: Language.ES,
  "zh-cn": Language.ZHS,
  "zh-tw": Language.ZHT,
};

export const CONDITION_MAP = {
  mint: Condition.MINT,
  near_mint: Condition.NEAR_MINT,
  slightly_played: Condition.EXCELLENT,
  moderately_played: Condition.GOOD,
  played: Condition.LIGHT_PLAYED,
  poor: Condition.POOR,
};

export const CARDTRADER_CSV_HEADERS = [
  "game",
  "setReleasedAt",
  "setName",
  "setCode",
  "itemName",
  "priceInEurCents",
  "quantity",
  "condition",
  "language",
  "foilReverse",
  "signed",
  "altered",
  "firstEdition",
  "collectorNumber",
];

/**
 * Normalizes a string into a lowercase, underscore-separated token.
 *
 * @param input - The string to normalize.
 * @returns The trimmed, lowercased string with every run of whitespace replaced by a single underscore.
 */
export function toSnakeCase(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "_");
}

/**
 * Maps a CardTrader language code to the corresponding Language enum value.
 *
 * @param language - The CardTrader language code, case-insensitive (e.g. "en", "zh-cn").
 * @returns The matching Language enum value.
 * @throws {Error} When the language code has no known mapping.
 */
export function normalizeLanguage(language: string): Language {
  const key = language.toLowerCase() as keyof typeof LANGUAGE_MAP;
  const mapped = LANGUAGE_MAP[key];

  if (!mapped) {
    throw new Error(`Unknown language: ${language}`);
  }

  return mapped;
}

/**
 * Maps a CardTrader condition label to the corresponding Condition enum value.
 *
 * @param condition - The CardTrader condition label, in any case and spacing (e.g. "Near Mint").
 * @returns The matching Condition enum value.
 * @throws {Error} When the condition label has no known mapping.
 */
export function normalizeCondition(condition: string): Condition {
  const key = toSnakeCase(condition) as keyof typeof CONDITION_MAP;
  const mapped = CONDITION_MAP[key];

  if (!mapped) {
    throw new Error(`Unknown condition: ${condition}`);
  }

  return mapped;
}

/**
 * Interprets a CardTrader flag value as a boolean.
 *
 * @param value - The raw flag value.
 * @returns True when the value is the string "true", case-insensitive; false otherwise.
 */
export function normalizeBoolean(value: string): boolean {
  return value.toLowerCase() === "true";
}

/**
 * Reduces a CardTrader collector number to the bare number used by Scryfall.
 *
 * @param collectorNumber - The raw collector number, optionally prefixed with a token marker, a set size (e.g. "123/264"), or leading zeroes.
 * @returns The lowercased collector number stripped of whitespace, the leading "t", the set size prefix, and leading zeroes.
 */
export function normalizeCollectorNumber(collectorNumber: string): string {
  const parsed = collectorNumber
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/^t/, "")
    .replace(/^\d+\//, "")
    .replace(/^0+/, "");

  return parsed;
}

/**
 * Converts a raw CSV order row into a typed order item, keeping the original row for reference.
 *
 * @param raw - The raw order row parsed from a CardTrader CSV export.
 * @returns The normalized order item, with the source row available as rawItem.
 * @throws {Error} When the row carries an unknown language or condition.
 */
export function normalizeOrderItem(raw: OrderItemRaw): OrderItem {
  return {
    ...raw,
    setCode: raw.setCode.trim().toLowerCase(),
    condition: normalizeCondition(raw.condition),
    language: normalizeLanguage(raw.language),
    priceInEurCents: parseInt(raw.priceInEurCents, 10),
    quantity: parseInt(raw.quantity, 10),
    foilReverse: normalizeBoolean(raw.foilReverse),
    signed: normalizeBoolean(raw.signed),
    altered: normalizeBoolean(raw.altered),
    collectorNumber: normalizeCollectorNumber(raw.collectorNumber),
    rawItem: raw,
  };
}

/**
 * Groups order items that describe the same printing, summing their quantities and prices.
 *
 * @param items - The normalized order items to aggregate.
 * @returns A map keyed by set code, collector number, language, foil flag, and condition, each entry holding the summed quantity, the summed total price, and one representative item.
 */
export function aggregateOrderItems(items: OrderItem[]): AggregatedOrderItems {
  return items.reduce((aggregate, item) => {
    const key: AggregatedKey = `${item.setCode}_${item.collectorNumber}_${item.language}_${item.foilReverse}_${item.condition}`;

    if (!aggregate[key]) {
      aggregate[key] = {
        quantity: 0,
        totalPrice: 0,
        item: item,
      };
    }

    aggregate[key].quantity += item.quantity;
    aggregate[key].totalPrice += item.priceInEurCents;

    return aggregate;
  }, {} as AggregatedOrderItems);
}

/**
 * Extracts the CardTrader order id from a free-form string, such as an export file name.
 *
 * @param str - The string expected to contain an order reference (e.g. "Order #AB12").
 * @returns The normalized order id, in the form "order_#ab12".
 * @throws {Error} When no order reference is found in the string.
 */
export function extractOrderId(str: string): string {
  const normalized = toSnakeCase(str);
  const match = normalized.match(/order_#?[a-z0-9]+/gi);

  if (!match) {
    throw new Error(`Cannot extract order id from string: ${str}`);
  }

  return match[0];
}
