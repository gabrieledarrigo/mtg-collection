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

export function toSnakeCase(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "_");
}

export function normalizeLanguage(language: string): Language {
  const key = language.toLowerCase() as keyof typeof LANGUAGE_MAP;
  const mapped = LANGUAGE_MAP[key];

  if (!mapped) {
    throw new Error(`Unknown language: ${language}`);
  }

  return mapped;
}

export function normalizeCondition(condition: string): Condition {
  const key = toSnakeCase(condition) as keyof typeof CONDITION_MAP;
  const mapped = CONDITION_MAP[key];

  if (!mapped) {
    throw new Error(`Unknown condition: ${condition}`);
  }

  return mapped;
}

export function normalizeBoolean(value: string): boolean {
  return value.toLowerCase() === "true";
}

export function normalizeCollectorNumber(collectorNumber: string): string {
  const parsed = collectorNumber
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/^t/, "")
    .replace(/^\d+\//, "")
    .replace(/^0+/, "");

  return parsed;
}

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

export function extractOrderId(str: string): string {
  const match = str.match(/order_[a-z0-9]+/gi);

  if (!match) {
    throw new Error(`Cannot extract order id from string: ${str}`);
  }

  return match[0];
}
