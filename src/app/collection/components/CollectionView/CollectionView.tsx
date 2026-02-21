"use client";

import { CollectionItemWithCard } from "@database/models";
import { ViewToggle } from "../FilterBar/FilterBar";
import { CardsGrid } from "../CardsGrid/CardsGrid";
import { CardsTable } from "../CardsTable/CardsTable";
import { useSearchParams } from "next/navigation";

export type CollectionViewProps = {
  collectionItems: CollectionItemWithCard[];
};

export function CollectionView({ collectionItems }: CollectionViewProps) {
  const params = useSearchParams();
  const view = (params.get("view") ?? ViewToggle.grid) as ViewToggle;

  return view === ViewToggle.grid ? (
    <CardsGrid collectionItems={collectionItems} />
  ) : (
    <CardsTable collectionItems={collectionItems} />
  );
}
