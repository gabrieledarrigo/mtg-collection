import { describe, it, expect } from "@jest/globals";
import { createMock } from "@test/helpers";
import { Condition, Language, CollectionItemWithCard } from "@database/models";
import { formatCollectionItemTotalPrice } from "./format";

describe("formatCollectionItemTotalPrice", () => {
  const collectionItem = createMock<CollectionItemWithCard>({
    id: "collection-item-1",
    card: {
      id: "card-id-1",
      name: "Card 1",
      setName: "Set",
      setCode: "set",
      collectorNumber: "1",
      language: Language.IT,
    },
    quantity: 12,
    condition: Condition.MINT,
    foil: true,
    purchases: [
      {
        price: 1250,
      },
      {
        price: 1370,
      },
    ],
  });

  it("should format the total price of the purchases for a collection item", () => {
    const actual = formatCollectionItemTotalPrice(collectionItem);

    expect(actual).toEqual("26,20\u00A0€");
  });
});
