import { CollectionItemWithCard } from "@database/models";

/**
 * Formats the total price of all purchases in a collection item as a currency string.
 *
 * @param collectionItem - A collection item with associated purchases.
 * @returns A formatted string representing the total price in EUR.
 */
export function formatCollectionItemTotalPrice(
  collectionItem: CollectionItemWithCard,
) {
  const total =
    collectionItem.purchases.reduce(
      (purchases, purchase) => purchases + purchase.price,
      0,
    ) / 100;

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(total);
}
