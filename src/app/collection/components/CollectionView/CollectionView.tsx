import { CollectionItemWithCard } from "@database/models";
import { ViewToggle } from "@app/lib/types";
import { CardsGrid } from "../CardsGrid/CardsGrid";
import { CardsTable } from "../CardsTable/CardsTable";

export type CollectionViewProps = {
  collectionItems: CollectionItemWithCard[];
  view?: ViewToggle;
};

export function CollectionView({
  view = ViewToggle.GRID,
  collectionItems,
}: CollectionViewProps) {
  return view === ViewToggle.GRID ? (
    <CardsGrid collectionItems={collectionItems} />
  ) : (
    <CardsTable collectionItems={collectionItems} />
  );
}
