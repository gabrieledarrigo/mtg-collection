import { CollectionItemWithCard } from "@app/lib/collection";
import { describe, it, expect } from "@jest/globals";
import { createMock } from "@test/helpers";
import { render, screen } from "@testing-library/react";
import { CardsGrid } from "./CardsGrid";

describe("CardsGrid", () => {
  const collectionItemOne = createMock<CollectionItemWithCard>({
    id: "collection-item-1",
    card: {
      id: "card-id-1",
    },
    purchases: [],
  });

  const collectionItemTwo = createMock<CollectionItemWithCard>({
    id: "collection-item-1",
    card: {
      id: "card-id-1",
    },
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
});
