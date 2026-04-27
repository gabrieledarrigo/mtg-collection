import { describe, it, expect } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import { CardsTable } from "./CardsTable";
import { Language, Condition, CollectionItemWithCard } from "@database/models";
import { createMock } from "@test/helpers";
import { ConditionLabel } from "@app/lib/types";

describe("CardsTable", () => {
  const collectionItemOne = createMock<CollectionItemWithCard>({
    id: "collection-item-1",
    card: {
      id: "card-id-1",
      name: "Card 1",
      setName: "Set",
      setCode: "set",
      collectorNumber: "1",
      colorIdentity: ["U"],
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
        price: 1000,
      },
    ],
  });

  const collectionItemTwo = createMock<CollectionItemWithCard>({
    id: "collection-item-2",
    card: {
      id: "card-id-2",
      name: "Card 2",
      setName: "Set",
      setCode: "set",
      collectorNumber: "2",
      colorIdentity: ["B"],
      language: Language.IT,
    },
    quantity: 3,
    condition: Condition.MINT,
    foil: false,
    purchases: [
      {
        price: 7500,
      },
      {
        price: 1145,
      },
    ],
  });

  it("should render a table with the given cards", () => {
    const collectionItems = [collectionItemOne, collectionItemTwo];

    render(<CardsTable collectionItems={collectionItems} />);

    const tableElement = screen.getByRole("table");

    expect(tableElement).toBeInTheDocument();

    const tableHeads = screen.getAllByRole("rowgroup");
    const tableHead = tableHeads.at(0)!;

    expect(within(tableHead).getByText("Quantity")).toBeInTheDocument();
    expect(within(tableHead).getByText("Name")).toBeInTheDocument();
    expect(within(tableHead).getByText("Color")).toBeInTheDocument();
    expect(within(tableHead).getByText("Set")).toBeInTheDocument();
    expect(within(tableHead).getByText("Condition")).toBeInTheDocument();
    expect(within(tableHead).getByText("Foil")).toBeInTheDocument();
    expect(within(tableHead).getByText("Language")).toBeInTheDocument();
    expect(within(tableHead).getByText("Price")).toBeInTheDocument();

    const tableBody = tableHeads.at(1)!;
    const rows = within(tableBody).getAllByRole("row");
    const firstRow = rows.at(0)!;

    expect(rows).toHaveLength(collectionItems.length);
    expect(
      within(firstRow).getByText(collectionItemOne.quantity),
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByText(collectionItemOne.card.name),
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByRole("img", { name: "Mana U" }),
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByText(
        `${collectionItemOne.card.setCode.toUpperCase()} - #${collectionItemOne.card.collectorNumber}`,
      ),
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByText(ConditionLabel[collectionItemOne.condition]),
    ).toBeInTheDocument();
    expect(within(firstRow).getByText("YES")).toBeInTheDocument();
    expect(
      within(firstRow).getByText(collectionItemOne.card.language),
    ).toBeInTheDocument();
    expect(within(firstRow).getByText("12")).toBeInTheDocument();
    expect(within(firstRow).getByText("22,50 €")).toBeInTheDocument();

    const secondRow = rows.at(1)!;

    expect(
      within(secondRow).getByText(collectionItemTwo.quantity),
    ).toBeInTheDocument();
    expect(
      within(secondRow).getByText(collectionItemTwo.card.name),
    ).toBeInTheDocument();
    expect(
      within(secondRow).getByRole("img", { name: "Mana B" }),
    ).toBeInTheDocument();
    expect(
      within(secondRow).getByText(
        `${collectionItemTwo.card.setCode.toUpperCase()} - #${collectionItemTwo.card.collectorNumber}`,
      ),
    ).toBeInTheDocument();
    expect(
      within(secondRow).getByText(ConditionLabel[collectionItemTwo.condition]),
    ).toBeInTheDocument();
    expect(within(secondRow).getByText("NO")).toBeInTheDocument();
    expect(
      within(secondRow).getByText(collectionItemTwo.card.language),
    ).toBeInTheDocument();
    expect(within(secondRow).getByText("3")).toBeInTheDocument();
    expect(within(secondRow).getByText("86,45 €")).toBeInTheDocument();
  });
});
