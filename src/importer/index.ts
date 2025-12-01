import { join } from "path";
import fs from "node:fs";
import { ScryfallCard } from "@scryfall/api-types";
import { Card, prisma, Source } from "@database/index";
import { DEFAULT_USER } from "@config/index";
import {
  aggregateOrderItems,
  CARDTRADER_CSV_HEADERS,
  normalizeOrderItem,
  OrderItem,
  OrderItemRaw,
} from "./cardtrader";
import { bySetAndNumber, toCardData } from "./scryfall/index";
import { parseCSV, writeCsv } from "./csv";
import { createPurchase, upsertCard, upsertCollectionItem } from "./collection";

type ImportError = {
  item: OrderItem;
  error: Error;
};

type ImportResult = {
  scryfallCard: ScryfallCard.Any;
  card: Card;
  quantity: number;
  item: OrderItem;
  totalPrice: number;
};

async function main() {
  const filename = process.argv[2];

  if (!filename) {
    console.log("Please provide a path to a CardTrader CSV file to import.");
    process.exit(1);
  }

  if (!fs.existsSync(filename)) {
    console.log(`File not found: ${filename}`);
    process.exit(1);
  }

  const items = await parseCSV<OrderItemRaw>(filename, {
    headers: CARDTRADER_CSV_HEADERS,
    skipLines: 1,
  });

  if (items.length === 0) {
    throw new Error("CSV is empty or invalid");
  }

  const aggregatedItems = aggregateOrderItems(items.map(normalizeOrderItem));

  const total = Object.keys(aggregatedItems).length;
  const results: ImportResult[] = [];
  const errors: ImportError[] = [];

  for (const key of Object.keys(aggregatedItems)) {
    const { item, quantity, totalPrice } =
      aggregatedItems[key as keyof typeof aggregatedItems]!;

    console.log(
      `Parsing order item ${item.itemName} for: ${item.setCode}, ${item.collectorNumber}, ${item.language}`,
    );

    try {
      const scryfallCard = await bySetAndNumber(
        item.setCode,
        item.collectorNumber,
        item.language,
      );

      await prisma.$transaction(async (transaction) => {
        const card = await upsertCard(toCardData(scryfallCard), transaction);

        const collectionItem = await upsertCollectionItem(
          card,
          {
            userId: DEFAULT_USER.id!,
            foil: item.foilReverse,
            condition: item.condition,
            quantity,
          },
          transaction,
        );

        await createPurchase(
          collectionItem,
          {
            orderId: Date.now().toString(),
            quantity,
            price: totalPrice,
            source: Source.CARDTRADER,
          },
          transaction,
        );

        results.push({ scryfallCard, card, quantity, item, totalPrice });
      });
    } catch (err: any) {
      console.error(`Error fetching card for ${item.itemName}: ${err.message}`);
      errors.push({ item, error: err });
    }

    console.log(
      `Cards found: ${results.length}. Errors: ${errors.length}. Progress: ${(((results.length + errors.length) / total) * 100).toFixed(2)}%`,
    );
  }

  console.log(`Successfully stored ${results.length} cards in collection.`);

  if (errors.length > 0) {
    const csvErrorFilename = `scryfall_errors_${Date.now()}.csv`;

    console.log(
      `${errors.length} errors. Writing a CSV with the results to data/${csvErrorFilename}`,
    );

    await writeCsv(
      join(__dirname, `../../data/${csvErrorFilename}`),
      errors.map(({ item, error }) => ({
        ...item,
        error,
      })),
    );
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
