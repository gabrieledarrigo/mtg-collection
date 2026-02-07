import { CollectionItemWithCard } from "@app/lib/collection";
import { describe, it, expect } from "@jest/globals";
import { createMock } from "@test/helpers";
import { render, screen } from "@testing-library/react";
import { Card, CardVariant, NO_IMAGE_AVAILABLE } from "./Card";
import { Condition } from "@database/index";
import { Badge } from "@app/components/Badge/Badge";

describe("Card", () => {
  const collectionItem = createMock<CollectionItemWithCard>({
    id: "collection-item-1",
    card: {
      id: "card-id-1",
      imageUrlNormal:
        "https://cards.scryfall.io/normal/front/e/5/e574e522-2632-4cd4-8545-c582ac3b641f.jpg?1562632572",
      imageUrlLarge:
        "https://cards.scryfall.io/large/front/e/5/e574e522-2632-4cd4-8545-c582ac3b641f.jpg?1562632572",
      name: "Brainstorm",
    },
    quantity: 4,
    condition: Condition.NEAR_MINT,
    purchases: [],
  });

  it("should a render card", () => {
    render(<Card collectionItem={collectionItem} />);

    const cardElement = screen.getByRole("article");
    const image = screen.getByRole("img");

    expect(cardElement).toBeInTheDocument();
    expect(image.getAttribute("src")).toContain(
      encodeURIComponent(collectionItem.card.imageUrlNormal!),
    );
  });

  it("should render the normal image size", () => {
    render(<Card collectionItem={collectionItem} />);

    const image = screen.getByRole("img");

    expect(image.getAttribute("src")).toContain(
      encodeURIComponent(collectionItem.card.imageUrlNormal!),
    );
  });

  it("should render the large image size for the large variant", () => {
    render(
      <Card collectionItem={collectionItem} variant={CardVariant.LARGE} />,
    );

    const image = screen.getByRole("img");

    expect(image.getAttribute("src")).toContain(
      encodeURIComponent(collectionItem.card.imageUrlLarge!),
    );
  });

  it("should render the NO_IMAGE_AVAILABLE image when the card does not have an image", () => {
    render(
      <Card
        collectionItem={{
          ...collectionItem,
          card: {
            ...collectionItem.card,
            imageUrlSmall: null,
            imageUrlNormal: null,
            imageUrlLarge: null,
          },
        }}
      />,
    );

    const image = screen.getByRole("img");

    expect(image.getAttribute("src")).toContain(
      encodeURIComponent(NO_IMAGE_AVAILABLE),
    );
  });

  it("should render the footer", () => {
    const footer = <Badge text={collectionItem.quantity} />;

    render(<Card collectionItem={collectionItem} footer={footer} />);

    const quantity = screen.getByText(`${collectionItem.quantity}`);

    expect(quantity).toBeInTheDocument();
  });
});
