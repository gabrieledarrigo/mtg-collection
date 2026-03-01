import { Condition, Language, CollectionItemWithCard } from "@database/models";
import { describe, it, expect } from "@jest/globals";
import { createMock } from "@test/helpers";
import { render, screen } from "@testing-library/react";
import { CardsGrid } from "./CardsGrid";

describe("CardsGrid", () => {
  const collectionItemOne = createMock<CollectionItemWithCard>({
    id: "collection-item-1",
    card: {
      id: "card-id-1",
      name: "Card 1",
      setName: "Set",
      setCode: "set",
      collectorNumber: "1",
      language: Language.IT,
    },
    condition: Condition.MINT,
    purchases: [],
  });

  const collectionItemTwo = createMock<CollectionItemWithCard>({
    id: "collection-item-2",
    card: {
      id: "card-id-2",
      name: "Card 2",
      setName: "Set",
      setCode: "set",
      collectorNumber: "2",
      language: Language.IT,
    },
    condition: Condition.MINT,
    purchases: [],
  });

  const collectionItems = [collectionItemOne, collectionItemTwo];

  it("should render a grid of cards", () => {
    render(<CardsGrid collectionItems={collectionItems} />);

    const cardElements = screen.getAllByRole("article");

    expect(cardElements).toHaveLength(collectionItems.length);
  });

  it("should render a message when there are no cards in the collection", () => {
    render(<CardsGrid collectionItems={[]} />);

    const message = screen.getByText("There are no cards in your collection!");

    expect(message).toBeInTheDocument();
  });

  it("should render the quantity, condition, language, and foil for each card", () => {
    render(<CardsGrid collectionItems={collectionItems} />);

    const quantity = screen.getAllByTitle(/Quantity/i);
    const condition = screen.getAllByTitle(/Condition/i);
    const language = screen.getAllByTitle(/Language/i);
    const foil = screen.getAllByTitle(/Foil/i);

    expect(quantity).toHaveLength(2);
    expect(condition).toHaveLength(2);
    expect(language).toHaveLength(2);
    expect(foil).toHaveLength(2);
  });
});
