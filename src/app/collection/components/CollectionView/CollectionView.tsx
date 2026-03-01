"use client";

import { CollectionItemWithCard } from "@database/models";
import { ViewToggle } from "@app/lib/view";
import { CardsGrid } from "../CardsGrid/CardsGrid";
import { CardsTable } from "../CardsTable/CardsTable";

export type CollectionViewProps = {
  collectionItems: CollectionItemWithCard[];
  view?: ViewToggle;
};

export function CollectionView({
  view = ViewToggle.grid,
  collectionItems,
}: CollectionViewProps) {
  return view === ViewToggle.grid ? (
    <CardsGrid collectionItems={collectionItems} />
  ) : (
    <CardsTable collectionItems={collectionItems} />
  );
}
