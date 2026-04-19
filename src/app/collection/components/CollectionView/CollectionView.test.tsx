import { Condition, Language, CollectionItemWithCard } from "@database/models";
import { describe, it, expect } from "@jest/globals";
import { createMock } from "@test/helpers";
import { render, screen } from "@testing-library/react";
import { CollectionView } from "./CollectionView";
import { ViewToggle } from "@app/lib/types";

describe("CollectionView", () => {
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

  it("should render a grid of cards by default", () => {
    render(<CollectionView collectionItems={collectionItems} />);

    const cardElements = screen.getAllByRole("article");

    expect(cardElements).toHaveLength(collectionItems.length);
  });

  it("should render a grid of cards when the given view prop is grid", () => {
    render(
      <CollectionView
        view={ViewToggle.GRID}
        collectionItems={collectionItems}
      />,
    );

    const cardElements = screen.getAllByRole("article");

    expect(cardElements).toHaveLength(collectionItems.length);
  });

  it("should render a table when the given view prop is table", () => {
    render(
      <CollectionView
        view={ViewToggle.TABLE}
        collectionItems={collectionItems}
      />,
    );

    const tableElement = screen.getByRole("table");

    expect(tableElement).toBeInTheDocument();
  });
});
